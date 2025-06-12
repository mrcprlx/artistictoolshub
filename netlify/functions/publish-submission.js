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
        console.log('Starting publish-submission function');
        const { submissionId } = JSON.parse(event.body);
        if (!submissionId) {
            console.log('Missing submissionId');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing submissionId' }),
            };
        }

        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const branch = 'submissions';
        const path = `content/creations/${submissionId}.md`;

        // Fetch existing file
        let fileResponse;
        try {
            fileResponse = await axios.get(
                `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                        'If-None-Match': '',
                    },
                }
            );
        } catch (error) {
            console.log('Error fetching file', { path, error: error.message });
            return {
                statusCode: error.response?.status || 500,
                body: JSON.stringify({ message: 'Failed to fetch submission', details: error.message }),
            };
        }

        const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
        const { data, content } = matter(fileContent);
        console.log('Existing frontmatter:', data);

        if (data.status === 'published') {
            console.log('Submission already published', { submissionId });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Submission already published' }),
            };
        }

        // Update frontmatter with status: published, preserve createdAt
        const updatedData = {
            ...data,
            status: 'published',
            createdAt: data.createdAt || new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') // Fallback if missing
        };

        // Reconstruct markdown
        const textLines = updatedData.text ? updatedData.text.split('\n').map(line => `  ${line}`).join('\n') : '';
        const creatorLines = updatedData.creator ? updatedData.creator.split('\n').map(line => `  ${line}`).join('\n') : '';
        const newContent = `---
title: "${updatedData.title ? updatedData.title.replace(/"/g, '\\"') : 'Untitled'}"
text: |
${textLines}
image: "${updatedData.image || ''}"
creator: |
${creatorLines}
status: "${updatedData.status}"
createdAt: "${updatedData.createdAt}"
---
`;
        const base64Content = Buffer.from(newContent).toString('base64');

        // Update file in GitHub
        try {
            const controllerGitHub = new AbortController();
            const timeoutGitHub = setTimeout(() => controllerGitHub.abort(), 8000);
            await axios.put(
                `https://api.github.com/repos/${repo}/contents/${path}`,
                {
                    message: `Publish submission: ${updatedData.title || 'Untitled'}`,
                    content: base64Content,
                    sha: fileResponse.data.sha,
                    branch: 'submissions'
                },
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                    signal: controllerGitHub.signal,
                }
            );
            clearTimeout(timeoutGitHub);
            console.log('Submission published', { path });
        } catch (error) {
            console.log('GitHub API error', { message: error.message, response: error.response?.data });
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to publish submission',
                    details: error.message,
                    response: error.response?.data
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission published successfully' }),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};