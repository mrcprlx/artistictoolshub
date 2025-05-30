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

        // Validate submissionId format (submission-<uuid>)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        const submissionIdParts = submissionId.split('submission-');
        if (submissionIdParts.length !== 2 || !uuidRegex.test(submissionIdParts[1])) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid submissionId format. Expected: submission-<uuid>' }),
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
        const { data, content: markdownContent } = matter(fileContent);

        // Update status to rejected
        data.status = 'rejected';
        const updatedContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
text: |
  ${data.text.split('\n').map(line => `  ${line}`).join('\n')}
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
                message: `Reject submission: ${data.title}`,
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