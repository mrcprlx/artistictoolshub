const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        // Parse request body
        const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

        // Validate inputs
        if (!text || !recaptchaResponse) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: text or reCAPTCHA response' }),
            };
        }

        // Validate reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing reCAPTCHA secret key' }),
            };
        }
        const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${encodeURIComponent(recaptchaResponse)}`,
        });
        const recaptchaData = await recaptchaVerify.json();
        if (!recaptchaData.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA verification failed', details: recaptchaData }),
            };
        }

        // Upload image to Cloudinary if provided
        let imageUrl = '';
        if (image) {
            try {
                const formData = new FormData();
                // Explicitly specify the image as a base64 string
                formData.append('file', `data:image/jpeg;base64,${image}`); // Add prefix for Cloudinary
                formData.append('upload_preset', 'artistictoolshub');
                const cloudinaryResponse = await axios.post(
                    'https://api.cloudinary.com/v1_1/drxmkv1si/image/upload',
                    formData,
                    { headers: formData.getHeaders() }
                );
                imageUrl = cloudinaryResponse.data.secure_url;
            } catch (cloudinaryError) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Failed to upload image to Cloudinary', details: cloudinaryError.message }),
                };
            }
        }

        // Create draft entry in GitHub
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing GitHub token' }),
            };
        }
        const repoOwner = 'mrcprlx';
        const repoName = 'artistictoolshub';
        const branch = 'main';
        const filePath = `content/creations/${uuidv4()}.md`;
        const frontmatter = `---
title: "${text.split(/\s+/).slice(0, 5).join(' ')}"
text: "${text}"
image: "${imageUrl}"
creator: "${author || ''}"
published: false
---`;
        const content = Buffer.from(frontmatter).toString('base64');

        try {
            await axios.put(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
                {
                    message: 'New creation submission',
                    content: content,
                    branch: branch,
                },
                {
                    headers: { Authorization: `Bearer ${githubToken}` },
                }
            );
        } catch (githubError) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to create GitHub file', details: githubError.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission successful, pending review' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};