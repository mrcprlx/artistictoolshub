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
        const { submissionId } = JSON.parse(event.body);
        if (!submissionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing submissionId' }),
            };
        }

        console.log('Rejecting submission', { submissionId });
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const path = `content/creations/${submissionId}.md`;

        // Fetch submission from submissions branch
        let file;
        try {
            const fileResponse = await axios.get(
                `https://api.github.com/repos/${repo}/contents/${path}?ref=submissions`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            file = fileResponse.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: `Submission not found: ${submissionId}` }),
                };
            }
            throw error;
        }

        const fileContent = Buffer.from(file.content, 'base64').toString('utf-8');
        let data, markdownContent;
        try {
            const parsed = matter(fileContent);
            data = parsed.data;
            markdownContent = parsed.content;
        } catch (parseError) {
            console.log('Failed to parse frontmatter', { error: parseError.message });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid submission format: failed to parse frontmatter', details: parseError.message }),
            };
        }

        // Update status to rejected
        data.status = 'rejected';
        const textLines = (data.text || '').split('\n').map(line => `  ${line.trim()}`).join('\n');
        const updatedContent = `---
title: "${(data.title || 'Untitled').replace(/"/g, '\\"')}"
text: |
${textLines}
image: "${data.image || ''}"
creator: "${data.creator || ''}"
status: "rejected"
---
${markdownContent}`;
        const base64Content = Buffer.from(updatedContent).toString('base64');

        // Update file in submissions branch
        await axios.put(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            {
                message: `Reject submission: ${data.title || 'Untitled'}`,
                content: base64Content,
                sha: file.sha,
                branch: 'submissions'
            },
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission rejected successfully' }),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};