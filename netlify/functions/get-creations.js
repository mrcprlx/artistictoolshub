const fetch = require('node-fetch');

exports.handler = async () => {
    try {
        console.log('Starting get-creations function');
        const netlifyApiToken = process.env.NETLIFY_API_TOKEN;
        if (!netlifyApiToken) {
            console.log('Missing Netlify API token');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing Netlify API token' }),
            };
        }

        // Fetch form submissions from Netlify
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        const response = await fetch('https://api.netlify.com/api/v1/forms/creation-submission/submissions', {
            method: 'GET',
            headers: { Authorization: `Bearer ${netlifyApiToken}` },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.log('Failed to fetch Netlify Forms submissions:', await response.text());
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: 'Failed to fetch submissions' }),
            };
        }

        const submissions = await response.json();
        const creations = submissions
            .filter(sub => sub.data.published) // Only include published submissions
            .map(sub => ({
                id: sub.data.submission_id,
                title: sub.data.title,
                text: sub.data.text,
                image: sub.data.image || '',
                creator: sub.data.creator || '',
                published: sub.data.published
            }));

        console.log('Fetched creations:', creations.length);
        return {
            statusCode: 200,
            body: JSON.stringify(creations),
        };
    } catch (error) {
        console.log('Server error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};