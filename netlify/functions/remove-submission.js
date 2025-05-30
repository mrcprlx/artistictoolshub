const axios = require('axios');
const matter = require('gray-matter');
const cloudinary = require('cloudinary').v2;

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

        console.log('Removing submission', { submissionId });
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const path = `content/creations/${submissionId}.md`;
        const branch = 'submissions';

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        // Fetch submission to get image URL
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
        let data;
        try {
            const parsed = matter(fileContent);
            data = parsed.data;
        } catch (parseError) {
            console.log('Failed to parse frontmatter', { error: parseError.message });
            data = { image: '' };
        }

        // Delete image from Cloudinary if exists
        if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
            try {
                const urlParts = data.image.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split('.')[0];
                console.log('Attempting to delete Cloudinary image', { publicId, imageUrl: data.image });

                if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                    console.log('Cloudinary credentials missing, skipping image deletion');
                } else {
                    const destroyResult = await cloudinary.uploader.destroy(publicId, { invalidate: true });
                    console.log('Cloudinary destroy result', { result: destroyResult });
                    if (destroyResult.result !== 'ok') {
                        console.log('Failed to delete Cloudinary image', { result: destroyResult });
                    } else {
                        console.log('Deleted image from Cloudinary', { publicId });
                    }
                }
            } catch (cloudinaryError) {
                console.log('Cloudinary deletion error', {
                    message: cloudinaryError.message,
                    status: cloudinaryError.http_code,
                    details: cloudinaryError.response?.data || 'No additional details',
                });
            }
        } else {
            console.log('No valid image to delete from Cloudinary', { image: data.image });
        }

        // Delete submission from GitHub
        await axios.delete(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                data: {
                    message: `Remove published submission: ${data.title || submissionId}`,
                    sha: file.sha,
                    branch: branch
                },
            }
        );
        console.log('Deleted submission from GitHub', { submissionId });

        // Check if directory is empty and add .gitkeep if needed
        let remainingFiles = [];
        try {
            const response = await axios.get(
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=${branch}`,
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

        if (remainingFiles.length === 0) {
            const gitkeepContent = Buffer.from('').toString('base64');
            await axios.put(
                `https://api.github.com/repos/${repo}/contents/content/creations/.gitkeep`,
                {
                    message: 'Add .gitkeep to content/creations after remove',
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission removed successfully' }),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};