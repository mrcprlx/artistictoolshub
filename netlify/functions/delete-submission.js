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
        const { submissionId, submissionIds } = JSON.parse(event.body);
        const idsToDelete = submissionIds || (submissionId ? [submissionId] : []);
        if (!idsToDelete.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing submissionId or submissionIds' }),
            };
        }

        console.log('Deleting submissions', { ids: idsToDelete });
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const branch = 'submissions';

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: 'drxmkv1si',
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        for (const id of idsToDelete) {
            const path = `content/creations/${id}.md`;

            // Fetch submission to get image URL
            let file;
            try {
                const fileResponse = await axios.get(
                    `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
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
                    console.log('Submission not found, skipping', { id });
                    continue;
                }
                throw error;
            }

            const fileContent = Buffer.from(file.content, 'base64').toString('utf-8');
            const { data } = matter(fileContent);

            // Delete image from Cloudinary if exists
            if (data.image) {
                try {
                    const publicId = data.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`artistictoolshub/${publicId}`, { invalidate: true });
                    console.log('Deleted image from Cloudinary', { publicId });
                } catch (cloudinaryError) {
                    console.log('Cloudinary deletion error', { message: cloudinaryError.message });
                    // Continue with deletion even if Cloudinary fails
                }
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
                        message: `Delete submission: ${data.title || id}`,
                        sha: file.sha,
                        branch: branch
                    },
                }
            );
            console.log('Deleted submission from GitHub', { id });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Successfully deleted ${idsToDelete.length} submission(s)` }),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};