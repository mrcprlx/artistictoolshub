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

        console.log('Publishing submission', { submissionId });
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const path = `content/creations/${submissionId}.md`;
        const branch = 'submissions';

        // Fetch submission from submissions branch
        const fileResponse = await axios.get(
            `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );
        const file = fileResponse.data;
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

        // Update status to published
        data.status = 'published';
        const textLines = (data.text || '').split('\n').map(line => `  ${line.trim()}`).join('\n');
        const creatorLines = (data.creator || '').split('\n').map(line => `  ${line.trim()}`).join('\n');
        const updatedContent = `---
title: "${(data.title || 'Untitled').replace(/"/g, '\\"')}"
text: |
${textLines}
image: "${data.image || ''}"
creator: |
${creatorLines}
status: "published"
---
${markdownContent}`;
        const base64Content = Buffer.from(updatedContent).toString('base64');

        // Update file in submissions branch
        await axios.put(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            {
                message: `Publish submission: ${data.title || submissionId}`,
                content: base64Content,
                branch: 'submissions',
                sha: file.sha
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