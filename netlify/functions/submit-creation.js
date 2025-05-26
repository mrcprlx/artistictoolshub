const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;

exports.handler = async (event) => {
    try {
        console.log('Function invoked: submit-creation', {
            method: event.httpMethod,
            path: event.path,
            body: event.body ? event.body.slice(0, 200) : 'No body',
            headers: event.headers,
            queryStringParameters: event.queryStringParameters
        });

        if (event.httpMethod === 'OPTIONS') {
            console.log('Handling OPTIONS request for submit-creation');
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: '',
            };
        }

        if (event.httpMethod !== 'POST') {
            console.error('Method not allowed in submit-creation:', event.httpMethod);
            return {
                statusCode: 405,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        let body;
        try {
            body = JSON.parse(event.body);
        } catch (error) {
            console.error('JSON parse error in submit-creation:', error);
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Invalid request body' }),
            };
        }

        const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = body;

        if (!text || !recaptchaResponse) {
            console.error('Missing fields in submit-creation:', { text, recaptchaResponse });
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Validate reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('reCAPTCHA Secret Key not configured in submit-creation');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Server configuration error' }),
            };
        }
        const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${recaptchaResponse}`,
        });

        const recaptchaData = await recaptchaVerify.json();
        if (!recaptchaData.success) {
            console.error('reCAPTCHA verification failed in submit-creation:', recaptchaData);
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'reCAPTCHA verification failed' }),
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

        let imageUrl = '';
        let publicId = '';
        if (image) {
            try {
                const uploadResult = await cloudinary.uploader.upload(image, {
                    upload_preset: 'artistictoolshub',
                    folder: 'artistictoolshub',
                    context: {
                        custom: {
                            text: text,
                            social_links: author || ''
                        }
                    }
                });
                imageUrl = uploadResult.secure_url;
                publicId = uploadResult.public_id;
                console.log('Cloudinary upload success:', { publicId, imageUrl });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError.message || cloudinaryError);
                return {
                    statusCode: 500,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Failed to upload image' }),
                };
            }
        }

        // Create Markdown content for Netlify CMS
        const slug = text.trim().split(/\s+/).slice(0, 5).join('-').toLowerCase();
        const content = `---
    text: ${text}
    ${imageUrl ? `image: ${imageUrl}` : ''}
    ${author ? `author: ${author}` : ''}
    ${publicId ? `public_id: ${publicId}` : ''}
    date: ${new Date().toISOString()}
    ---
    ${text}
    `;

        console.log('Saving to content/creations:', { slug, content });

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Submission received', publicId }),
        };
    } catch (error) {
        console.error('Function error in submit-creation:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Server error: ' + error.message }),
        };
    }
};