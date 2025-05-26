const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
    try {
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
                    resources: result.resources.map(r => ({
                        public_id: r.public_id,
                        url: r.secure_url,
                        type: r.type,
                        created_at: r.created_at,
                        context: r.context
                    })),
                    total_count: result.total_count,
                    next_cursor: result.next_cursor
                });
                const submissions = result.resources.map((resource) => ({
                    id: resource.public_id,
                    url: resource.secure_url,
                    created_at: resource.created_at,
                    status: resource.context?.custom?.status || 'pending',
                    text: resource.context?.custom?.text || '',
                    social_links: resource.context?.custom?.social_links || ''
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
            let body;
            try {
                body = JSON.parse(event.body);
            } catch (error) {
                console.error('JSON parse error in POST:', error);
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid request body' }),
                };
            }
            const { id, action } = body;
            if (!id || !['approve', 'decline'].includes(action)) {
                console.error('Invalid POST data:', { id, action });
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid action or ID' }),
                };
            }
            try {
                const updateResult = await cloudinary.api.update(id, {
                    context: { custom: { status: action } }
                });
                console.log('Cloudinary update success:', { id, action, updateResult });
                return {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `${action}ed submission ${id}` }),
                };
            } catch (cloudinaryError) {
                console.error('Cloudinary update error:', cloudinaryError.message || cloudinaryError);
                return {
                    statusCode: 500,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `Failed to ${action} submission: ${cloudinaryError.message || 'Unknown error'}` }),
                };
            }
        }

        if (event.httpMethod === 'DELETE') {
            let body;
            try {
                body = JSON.parse(event.body);
            } catch (error) {
                console.error('JSON parse error in DELETE:', error);
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid request body' }),
                };
            }
            const { id } = body;
            if (!id) {
                console.error('Invalid DELETE data:', { id });
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Invalid ID' }),
                };
            }
            try {
                await cloudinary.uploader.destroy(id);
                console.log('Cloudinary delete success:', { id });
                return {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `Deleted submission ${id}` }),
                };
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError.message || cloudinaryError);
                return {
                    statusCode: 500,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: `Failed to delete submission: ${cloudinaryError.message || 'Unknown error'}` }),
                };
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