const cloudinary = require('cloudinary').v2;

exports.handler = async (event, context) => {
    try {
        // Handle CORS pre-flight OPTIONS request
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

        // Check for authenticated user (via Netlify Identity or Auth0 token)
        const { identity } = context.clientContext || {};
        if (!identity || !identity.user) {
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: '874188631367555',
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        if (event.httpMethod === 'GET') {
            // Fetch submissions from Cloudinary
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
            // Update submission status in Cloudinary metadata
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
            // Delete submission from Cloudinary
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
        console.error('Error in manage-submissions:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Server error: ' + error.message }),
        };
    }
};