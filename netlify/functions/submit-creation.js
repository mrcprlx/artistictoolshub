const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

    // Validate reCAPTCHA
    const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=6LcsqUArAAAAAO_6yjshCF0v5LWEDKCFxTBcxiCv&response=${recaptchaResponse}`,
    });
    const recaptchaData = await recaptchaVerify.json();
    if (!recaptchaData.success) {
        return { statusCode: 400, body: 'reCAPTCHA verification failed' };
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
};