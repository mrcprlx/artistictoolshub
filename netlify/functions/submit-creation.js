const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

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
            console.error('Method not allowed:', event.httpMethod);
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
            console.error('JSON parse error:', error);
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Invalid request body' }),
            };
        }

        const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = body;

        if (!text || !recaptchaResponse) {
            console.error('Missing fields:', { text, recaptchaResponse });
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Validate reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('reCAPTCHA Secret Key not configured');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Server configuration error' }),
            };
        }
        const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${encodeURIComponent(recaptchaResponse)}`,
        });

        const recaptchaData = await recaptchaVerify.json();
        if (!recaptchaData.success) {
            console.error('reCAPTCHA verification failed:', recaptchaData);
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
                    context: { custom: { status: 'pending' } }
                });
                imageUrl = uploadResult.secure_url;
                publicId = uploadResult.public_id;
                console.log('Cloudinary upload success:', { publicId, imageUrl, context: uploadResult.context });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError.message || cloudinaryError);
                return {
                    statusCode: 500,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ message: 'Failed to upload image' }),
                };
            }
        }

        // Save to Netlify CMS (mock for now)
        const submissionId = uuidv4();
        const slug = text.trim().split(/\s+/).slice(0, 5).join('-').toLowerCase();
        const content = `---
submission_id: ${submissionId}
text: ${text.trim()}
${imageUrl ? `image: ${imageUrl}` : ''}
${publicId ? `public_id: ${publicId}` : ''}
${author ? `author: ${author.trim()}` : ''}
status: pending
date: ${new Date().toISOString()}
---
${text.trim()}
`;

        // Mock CMS storage (replace with GitHub API/Netlify CMS)
        global.mockCmsSubmissions = global.mockCmsSubmissions || [];
        global.mockCmsSubmissions.push({
            submission_id: submissionId,
            text: text.trim(),
            image: imageUrl,
            public_id: publicId,
            author: author ? author.trim() : '',
            status: 'pending',
            date: new Date().toISOString()
        });

        console.log('Saved to mock CMS:', { slug, content, submissionId });

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Submission received', submissionId, publicId }),
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