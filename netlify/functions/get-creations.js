const axios = require('axios');
const matter = require('gray-matter');

exports.handler = async () => {
    try {
        console.log('Starting get-creations function');
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub'; // Replace with actual repo owner and name

        // Get list of files in content/creations
        const response = await axios.get(
            `https://api.github.com/repos/${repo}/contents/content/creations`,
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );
        const files = response.data;

        // Fetch each file's content and parse front matter
        const creations = await Promise.all(
            files.map(async (file) => {
                if (file.type === 'file' && file.name.endsWith('.md')) {
                    const fileResponse = await axios.get(file.download_url);
                    const { data } = matter(fileResponse.data);
                    if (data.published) {
                        return { ...data, id: file.name.replace('.md', '') };
                    }
                }
                return null;
            })
        );

        const publishedCreations = creations.filter((c) => c !== null);
        console.log('Published creations', { count: publishedCreations.length });
        return {
            statusCode: 200,
            body: JSON.stringify(publishedCreations),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message, stack: error.stack }),
        };
    }
};