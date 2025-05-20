const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
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
                body: JSON.stringify({ message: 'Invalid request body' }),
            };
        }

        const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = body;

        if (!text || !recaptchaResponse) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Validate reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('reCAPTCHA Secret Key not configured');
            return {
                statusCode: 500,
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
            console.error('reCAPTCHA verification failed:', recaptchaData);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA verification failed' }),
            };
        }

        // Create Markdown content for Netlify CMS
        const slug = text.trim().split(/\s+/).slice(0, 5).join('-').toLowerCase();
        const content = `---
text: ${text}
${image ? `image: ${image}` : ''}
${author ? `author: ${author}` : ''}
date: ${new Date().toISOString()}
---
${text}
`;

        // Placeholder: Log content (replace with GitHub API commit in production)
        console.log('Saving to content/creations:', { slug, content });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission received' }),
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error: ' + error.message }),
        };
    }
};