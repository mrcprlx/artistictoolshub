const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

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

        // Extract token
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
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            console.error('Failed to decode token:', token);
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Unauthorized: Invalid token format' }),
            };
        }
        console.log('Decoded token payload:', decoded.payload);

        if (!Array.isArray(decoded.payload.aud) || !decoded.payload.aud.includes('https://artistictoolshub.com/api')) {
            console.error('Invalid audience in token:', decoded.payload.aud);
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Unauthorized: Invalid audience' }),
            };
        }

        // Configure Cloudinary
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
            console.error('CLOUDINARY_API_SECRET is not set');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Server error: Missing Cloudinary API secret' }),
            };
        }

        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: '874188631367555',
            api_secret: apiSecret,
            secure: true,
        });

        if (event.httpMethod === 'GET') {
            try {
                const result = await cloudinary.api.resources({
                    resource_type: 'image',
                    type: 'upload',
                    prefix: 'artistictoolshub',
                    max_results: 50,
                });
                console.log('Cloudinary API response:', {
                    resources: result.resources,
                    total_count: result.total_count,
                    next_cursor: result.next_cursor
                });
                const submissions = result.resources.map((resource) => ({
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
            } catch (cloudinaryError) {
                console.error('Cloudinary API error:', cloudinaryError.message || cloudinaryError);
                throw new Error(`Cloudinary error: ${cloudinaryError.message || 'Unknown error'}`);
            }
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
            try {
                await cloudinary.api.update(id, {
                    context: { custom: { status: action } },
                });
                return {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `${action}ed submission ${id}` }),
                };
            } catch (cloudinaryError) {
                console.error('Cloudinary API error:', cloudinaryError.message || cloudinaryError);
                throw new Error(`Cloudinary error: ${cloudinaryError.message || 'Unknown error'}`);
            }
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
            try {
                await cloudinary.uploader.destroy(id);
                return {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `Deleted submission ${id}` }),
                };
            } catch (cloudinaryError) {
                console.error('Cloudinary API error:', cloudinaryError.message || cloudinaryError);
                throw new Error(`Cloudinary error: ${cloudinaryError.message || 'Unknown error'}`);
            }
        }

        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    } catch (error) {
        console.error('Error in manage-submissions:', error.message || error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: `Server error: ${error.message || 'Unknown error'}` }),
        };
    }
};