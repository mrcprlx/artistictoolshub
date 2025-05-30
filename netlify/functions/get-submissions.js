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
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=submissions&t=${Date.now()}`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                        'If-None-Match': '', // Force fetch to bypass caching
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
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=main&t=${Date.now()}`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                        'If-None-Match': '', // Force fetch to bypass caching
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
                if (file.type === 'file' && file.name.endsWith('.md') && file.name !== '.gitkeep') {
                    try {
                        // Fetch file content directly via GitHub API to avoid CDN caching
                        const fileResponse = await axios.get(
                            `https://api.github.com/repos/${repo}/contents/${file.path}?ref=${file.path.includes('ref=main') ? 'main' : 'submissions'}&t=${Date.now()}`,
                            {
                                headers: {
                                    Authorization: `token ${githubToken}`,
                                    Accept: 'application/vnd.github.v3+json',
                                    'If-None-Match': '', // Force fetch
                                },
                            }
                        );
                        const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
                        const { data } = matter(fileContent);
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
        console.log('Fetched submissions', { count: filteredSubmissions.length, submissions: filteredSubmissions });
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