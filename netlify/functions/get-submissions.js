const axios = require('axios');
const matter = require('gray-matter');

exports.handler = async (event) => {
    if (!event.headers['x-netlify-identity-user']) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized: Admin access required' }),
        };
    }

    try {
        console.log('Starting get-submissions function');
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';

        let files = [];
        try {
            const response = await axios.get(
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=submissions`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            files = response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('No submissions found');
                return {
                    statusCode: 200,
                    body: JSON.stringify([]),
                };
            }
            throw error;
        }

        const submissions = await Promise.all(
            files.map(async (file) => {
                if (file.type === 'file' && file.name.endsWith('.md')) {
                    const fileResponse = await axios.get(file.download_url);
                    const { data } = matter(fileResponse.data);
                    return {
                        id: file.name.replace('.md', ''),
                        title: data.title || 'Untitled',
                        text: data.text || '',
                        image: data.image || '',
                        creator: data.creator || '',
                        published: data.published || false,
                    };
                }
                return null;
            })
        );

        const filteredSubmissions = submissions.filter(s => s !== null);
        console.log('Fetched submissions', { count: filteredSubmissions.length });
        return {
            statusCode: 200,
            body: JSON.stringify(filteredSubmissions),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};