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
        // Ensure the path matches the submission file name format
        const path = `content/creations/${submissionId}.md`;

        // Fetch submission from submissions branch
        const fileResponse = await axios.get(
            `https://api.github.com/repos/${repo}/contents/${path}?ref=submissions`,
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );
        const file = fileResponse.data;
        const fileContent = Buffer.from(file.content, 'base64').toString('utf-8');
        const { data, content: markdownContent } = matter(fileContent);

        // Update status to published
        data.status = 'published';
        const updatedContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
text: |
  ${data.text.split('\n').map(line => `  ${line}`).join('\n')}
image: "${data.image || ''}"
creator: "${data.creator || ''}"
status: "published"
---
${markdownContent}`;
        const base64Content = Buffer.from(updatedContent).toString('base64');

        // Move to main branch
        await axios.put(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            {
                message: `Publish submission: ${data.title}`,
                content: base64Content,
                branch: 'main'
            },
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        // Delete from submissions branch
        await axios.delete(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                data: {
                    message: `Remove published submission: ${data.title}`,
                    sha: file.sha,
                    branch: 'submissions'
                },
            }
        );

        // Trigger Netlify build
        const buildHook = process.env.NETLIFY_BUILD_HOOK;
        if (buildHook) {
            await axios.post(buildHook);
            console.log('Triggered Netlify build');
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