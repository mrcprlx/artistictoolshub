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
        console.log('Fetching submissions from Netlify Forms');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://api.netlify.com/api/v1/forms/creation-submission/submissions', {
            method: 'GET',
            headers: { Authorization: `Bearer ${netlifyApiToken}` },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.log('Failed to fetch Netlify Forms submissions', { status: response.status, text: await response.text() });
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: 'Failed to fetch submissions', details: await response.text() }),
            };
        }

        const submissions = await response.json();
        console.log('Raw submissions fetched', { count: submissions.length });

        // Handle empty or invalid submissions
        const creations = (submissions || [])
            .filter(sub => sub.data && (sub.data.published === true || sub.data.published === 'true'))
            .map(sub => ({
                id: sub.data.submission_id || uuidv4(),
                title: sub.data.title || 'Untitled',
                text: sub.data.text || '',
                image: sub.data.image || '',
                creator: sub.data.creator || '',
                published: sub.data.published
            }));

        console.log('Processed creations', { count: creations.length });
        return {
            statusCode: 200,
            body: JSON.stringify(creations),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        // Return empty array to prevent frontend crash
        return {
            statusCode: 200,
            body: JSON.stringify([]),
        };
    }
};