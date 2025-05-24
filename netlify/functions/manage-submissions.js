const fetch = require('node-fetch');

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

        const { identity } = context.clientContext || {};
        if (!identity || !identity.user) {
            return {
                statusCode: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }

        const cloudName = 'drxmkv1si';
        const apiKey = '874188631367555';
        const apiSecret = process.env.CLOUDINARY_API_SECRET; // Securely stored in Netlify
        if (!apiSecret) {
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Cloudinary API secret not configured' }),
            };
        }

        if (event.httpMethod === 'GET') {
            // Fetch submissions from Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=artistictoolshub`, {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
                },
            });
            const data = await response.json();
            const submissions = data.resources.map((resource) => ({
                id: resource.public_id,
                url: resource.secure_url,
                created_at: resource.created_at,
                status: 'pending', // Placeholder; adjust based on your metadata
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
            // Placeholder: Update metadata in Cloudinary (e.g., set status)
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
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                return {
                    statusCode: 400,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: data.error.message }),
                };
            }
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