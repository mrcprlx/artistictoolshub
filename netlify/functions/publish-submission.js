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
        const updatedContent = `---
title: "${(data.title || 'Untitled').replace(/"/g, '\\"')}"
text: |
${textLines}
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
        let remainingFiles = [];
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
            remainingFiles = response.data.filter(file => file.name !== submissionId + '.md');
        } catch (error) {
            if (error.response?.status !== 404) throw error;
        }

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

        // If no files remain, add .gitkeep to prevent directory deletion
        if (remainingFiles.length === 0) {
            const gitkeepContent = Buffer.from('').toString('base64');
            await axios.put(
                `https://api.github.com/repos/${repo}/contents/content/creations/.gitkeep`,
                {
                    message: 'Add .gitkeep to content/creations after publish',
                    content: gitkeepContent,
                    branch: 'submissions'
                },
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
        }

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