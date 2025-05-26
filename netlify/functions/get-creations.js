const cloudinary = require('cloudinary').v2;

exports.handler = async () => {
    try {
        console.log('Function invoked: get-creations');

        // Configure Cloudinary
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
            console.error('CLOUDINARY_API_SECRET is not set');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Server configuration error' }),
            };
        }

        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: '874188631367555',
            api_secret: apiSecret,
            secure: true,
        });

        // Fetch approved submissions
        const result = await cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload',
            prefix: 'artistictoolshub',
            max_results: 50,
        });

        const creations = result.resources
            .filter(resource => resource.context?.custom?.status === 'approve')
            .map(resource => ({
                id: resource.public_id,
                text: resource.context?.custom?.text || '',
                image: resource.secure_url || null,
                author: resource.context?.custom?.social_links || null,
                date: resource.created_at
            }));

        console.log('Fetched creations:', { count: creations.length });

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(creations),
        };
    } catch (error) {
        console.error('Function error in get-creations:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Server error: ' + error.message }),
        };
    }
};