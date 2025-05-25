const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

exports.handler = async (event, context) => {
    try {
        // Handle CORS pre-flight OPTIONS
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: '',
            };
        }

        // Validate Auth0 JWT token
        const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Missing or invalid Authorization header:', authHeader);
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Unauthorized: Missing or invalid token' }),
            };
        }

        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // Log token for debugging
        const jwksUris = [
            'https://dev-d07c5upcmrg0jedl.us.auth0.com/.well-known/jwks.json',
            'https://login.artistictoolshub.com/.well-known/jwks.json'
        ];

        let lastError = null;
        for (const uri of jwksUris) {
            try {
                const client = jwksClient({ jwksUri: uri });
                const decoded = await new Promise((resolve, reject) => {
                    const getKey = (header, callback) => {
                        client.getSigningKey(header.kid, (err, key) => {
                            if (err) {
                                console.error(`Error fetching JWKS key from ${uri}:`, err.message);
                                callback(err);
                            } else if (!key) {
                                console.error(`No signing key found for kid ${header.kid} at ${uri}`);
                                callback(new Error('No signing key found'));
                            } else {
                                const signingKey = key.publicKey || key.rsaPublicKey;
                                if (!signingKey) {
                                    console.error(`Invalid signing key for kid ${header.kid} at ${uri}`);
                                    callback(new Error('Invalid signing key'));
                                } else {
                                    callback(null, signingKey);
                                }
                            }
                        });
                    };

                    jwt.verify(token, getKey, {
                        audience: ['https://artistictoolshub.com/api', 'https://dev-d07c5upcmrg0jedl.us.auth0.com/userinfo'],
                        issuer: 'https://login.artistictoolshub.com/',
                        algorithms: ['RS256']
                    }, (err, decoded) => {
                        if (err) {
                            console.error(`JWT verification failed at ${uri}:`, err.message);
                            reject(err);
                        } else {
                            console.log('JWT verified successfully:', decoded);
                            resolve(decoded);
                        }
                    });
                });
                // If verification succeeds, proceed
                if (decoded) {
                    break;
                }
            } catch (error) {
                lastError = error;
                console.error(`Failed to verify with ${uri}:`, error.message);
                continue;
            }
        }

        if (!decoded) {
            throw lastError || new Error('All JWKS URIs failed');
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: '874188631367555',
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        if (event.httpMethod === 'GET') {
            const { resources } = await cloudinary.api.resources({
                resource_type: 'image',
                prefix: 'artistictoolshub',
                max_results: 50,
            });
            const submissions = resources.map((resource) => ({
                id: resource.public_id,
                url: resource.secure_url,
                created_at: resource.created_at,
                status: resource.context?.custom?.status || 'pending',
            }));

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(submissions),
            };
        }

        if (event.httpMethod === 'POST') {
            const { id, action } = JSON.parse(event.body);
            if (!id || !['approve', 'decline'].includes(action)) {
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid action or ID' }),
                };
            }
            await cloudinary.api.update(id, {
                context: { custom: { status: action } },
            });
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: `${action}ed submission ${id}` }),
            };
        }

        if (event.httpMethod === 'DELETE') {
            const { id } = JSON.parse(event.body);
            if (!id) {
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid ID' }),
                };
            }
            await cloudinary.uploader.destroy(id);
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: `Deleted submission ${id}` }),
            };
        }

        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    } catch (error) {
        console.error('Error in manage-submissions:', error.message);
        return {
            statusCode: 401,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Unauthorized: ' + error.message }),
        };
    }
};