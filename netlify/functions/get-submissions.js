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

        // Fetch submissions from both branches
        let submissionsFiles = [];
        let mainFiles = [];

        // Fetch from submissions branch (pending and rejected)
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
            submissionsFiles = response.data;
        } catch (error) {
            if (error.response?.status !== 404) throw error;
            console.log('No submissions found in submissions branch');
        }

        // Fetch from main branch (published)
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
            mainFiles = response.data;
        } catch (error) {
            if (error.response?.status !== 404) throw error;
            console.log('No submissions found in main branch');
        }

        // Process submissions from both branches
        const allFiles = [...submissionsFiles, ...mainFiles];
        const submissions = await Promise.all(
            allFiles.map(async (file) => {
                if (file.type === 'file' && file.name.endsWith('.md')) {
                    try {
                        const fileResponse = await axios.get(file.download_url);
                        const { data } = matter(fileResponse.data);
                        return {
                            id: file.name.replace('.md', ''),
                            title: data.title || 'Untitled',
                            text: data.text || '',
                            image: data.image || '',
                            creator: data.creator || '',
                            status: data.status || (file.path.includes('ref=main') ? 'published' : 'pending'),
                        };
                    } catch (error) {
                        console.log('Error processing file', { path: file.path, error: error.message });
                        return null;
                    }
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