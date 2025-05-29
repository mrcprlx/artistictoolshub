const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); // Added for reCAPTCHA verification

exports.handler = async (event) => {
    try {
        console.log('Starting submit-creation function');
        // Parse request body
        const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

        // Validate inputs
        if (!text || !recaptchaResponse) {
            console.log('Missing required fields');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: text or reCAPTCHA response' }),
            };
        }

        // Validate reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.log('Missing reCAPTCHA secret key');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing reCAPTCHA secret key' }),
            };
        }
        console.log('Verifying reCAPTCHA');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${encodeURIComponent(recaptchaResponse)}`,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const recaptchaData = await recaptchaVerify.json();
        if (!recaptchaData.success) {
            console.log('reCAPTCHA verification failed:', recaptchaData);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA verification failed', details: recaptchaData }),
            };
        }

        // Upload image to Cloudinary if provided
        let imageUrl = '';
        if (image) {
            if (typeof image !== 'string' || image.length === 0) {
                console.log('Invalid image data');
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid image data: must be a non-empty base64 string' }),
                };
            }
            try {
                console.log('Uploading image to Cloudinary');
                const formData = new FormData();
                formData.append('file', `data:image/jpeg;base64,${image}`);
                formData.append('upload_preset', 'artistictoolshub');

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
                const cloudinaryResponse = await axios.post(
                    'https://api.cloudinary.com/v1_1/drxmkv1si/image/upload',
                    formData,
                    { headers: formData.getHeaders(), signal: controller.signal }
                );
                clearTimeout(timeoutId);

                imageUrl = cloudinaryResponse.data.secure_url;
                console.log('Cloudinary upload successful:', imageUrl);
            } catch (cloudinaryError) {
                console.log('Cloudinary error:', cloudinaryError.message);
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Failed to upload image to Cloudinary',
                        details: cloudinaryError.message,
                        response: cloudinaryError.response?.data
                    }),
                };
            }
        }

        // Create draft entry in GitHub
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            console.log('Missing GitHub token');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing GitHub token' }),
            };
        }
        const repoOwner = 'mrcprlx';
        const repoName = 'artistictoolshub';
        const branch = 'main';
        const filePath = `content/creations/${uuidv4()}.md`;
        // Escape special characters in text for YAML
        const escapedText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        const frontmatter = `---
title: "${escapedText.split(/\s+/).slice(0, 5).join(' ')}"
text: "${escapedText}"
image: "${imageUrl}"
creator: "${author || ''}"
published: false
---`;
        const content = Buffer.from(frontmatter).toString('base64');

        try {
            console.log('Creating GitHub file:', filePath);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
            await axios.put(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
                {
                    message: 'New creation submission',
                    content: content,
                    branch: branch,
                },
                {
                    headers: { Authorization: `Bearer ${githubToken}` },
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);
            console.log('GitHub file created successfully');
        } catch (githubError) {
            console.log('GitHub error:', githubError.message);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to create GitHub file',
                    details: githubError.message,
                    response: githubError.response?.data
                }),
            };
        }

        console.log('Submission successful');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission successful, pending review' }),
        };
    } catch (error) {
        console.log('Server error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message }),
        };
    }
};