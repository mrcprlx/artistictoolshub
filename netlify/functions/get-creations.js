const axios = require('axios');
const matter = require('gray-matter');

exports.handler = async () => {
    try {
        console.log('Starting get-creations function');
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';

        let files = [];
        try {
            const response = await axios.get(
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=main`,
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
                console.log('No creations found');
                return {
                    statusCode: 200,
                    body: JSON.stringify([]),
                };
            }
            throw error;
        }

        const creations = await Promise.all(
            files.map(async (file) => {
                if (file.type === 'file' && file.name.endsWith('.md')) {
                    const fileResponse = await axios.get(file.download_url);
                    const { data } = matter(fileResponse.data);
                    if (data.status === 'published') {
                        return {
                            id: file.name.replace('.md', ''),
                            title: data.title || 'Untitled',
                            text: data.text || '',
                            image: data.image || '',
                            creator: data.creator || '',
                        };
                    }
                    return null;
                }
                return null;
            })
        );

        const filteredCreations = creations.filter(c => c !== null);
        console.log('Fetched creations', { count: filteredCreations.length });
        return {
            statusCode: 200,
            body: JSON.stringify(filteredCreations),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};