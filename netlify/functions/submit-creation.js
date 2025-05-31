const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        console.log('Starting submit-creation function', { body: event.body });
        // Parse request body
        const { title, text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

        // Validate inputs
        if (!title || !text || !recaptchaResponse) {
            console.log('Missing required fields', { title, text, recaptchaResponse });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: title, text, or reCAPTCHA response' }),
            };
        }
        if (title.length > 100) {
            console.log('Title exceeds 100 characters', { titleLength: title.length });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Title exceeds 100 characters' }),
            };
        }
        if (text.length > 5000) {
            console.log('Text exceeds 5000 characters', { charCount: text.length });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Text exceeds 5000 characters' }),
            };
        }

        // Validate reCAPTCHA v2 Invisible
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.log('Missing reCAPTCHA secret key');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server configuration error: Missing reCAPTCHA secret key' }),
            };
        }
        console.log('Verifying reCAPTCHA v2 Invisible');
        const controllerRecaptcha = new AbortController();
        const timeoutRecaptcha = setTimeout(() => controllerRecaptcha.abort(), 8000);
        const recaptchaVerify = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: secretKey,
                response: recaptchaResponse,
            },
            signal: controllerRecaptcha.signal,
        });
        clearTimeout(timeoutRecaptcha);
        const recaptchaData = recaptchaVerify.data;
        if (!recaptchaData.success) {
            console.log('reCAPTCHA v2 Invisible verification failed', recaptchaData);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA verification failed', details: recaptchaData }),
            };
        }

        // Upload image to Cloudinary if provided
        let imageUrl = '';
        if (image) {
            if (typeof image !== 'string' || image.length === 0) {
                console.log('Invalid image data', { image });
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid image data: must be a non-empty base64 string' }),
                };
            }
            const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            if (!base64Regex.test(image)) {
                console.log('Invalid base64 string', { image });
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid base64 image data' }),
                };
            }
            try {
                console.log('Uploading image to Cloudinary');
                const formData = new FormData();
                const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
                formData.append('file', `data:${mimeType};base64,${image}`);
                formData.append('upload_preset', 'artistictoolshub');
                const controllerCloudinary = new AbortController();
                const timeoutCloudinary = setTimeout(() => controllerCloudinary.abort(), 8000);
                const cloudinaryResponse = await axios.post(
                    'https://api.cloudinary.com/v1_1/drxmkv1si/image/upload',
                    formData,
                    { headers: formData.getHeaders(), signal: controllerCloudinary.signal }
                );
                clearTimeout(timeoutCloudinary);
                if (!cloudinaryResponse.data.secure_url) {
                    throw new Error('Cloudinary upload failed: No secure_url returned');
                }
                imageUrl = cloudinaryResponse.data.secure_url;
                console.log('Cloudinary upload successful', { imageUrl });
            } catch (cloudinaryError) {
                console.log('Cloudinary error', {
                    message: cloudinaryError.message,
                    response: cloudinaryError.response?.data
                });
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

        // Create markdown content with proper YAML formatting
        const submissionId = uuidv4();
        const textLines = text.split('\n').map(line => `  ${line}`).join('\n'); // Preserve line breaks
        const authorLines = author ? author.split('\n').map(line => `  ${line}`).join('\n') : '';
        const content = `---
title: "${title.replace(/"/g, '\\"')}"
text: |
${textLines}
image: "${imageUrl}"
creator: |
${authorLines}
status: "pending"
---
`;
        const base64Content = Buffer.from(content).toString('base64');

        // Ensure submissions branch exists
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub';
        const branch = 'submissions';
        try {
            await axios.get(`https://api.github.com/repos/${repo}/branches/${branch}`, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('Submissions branch not found, creating it');
                const mainBranch = await axios.get(`https://api.github.com/repos/${repo}/branches/main`, {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });
                await axios.post(
                    `https://api.github.com/repos/${repo}/git/refs`,
                    {
                        ref: `refs/heads/${branch}`,
                        sha: mainBranch.data.commit.sha,
                    },
                    {
                        headers: {
                            Authorization: `token ${githubToken}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    }
                );
                console.log('Created submissions branch');
            } else {
                throw error;
            }
        }

        // Ensure content/creations directory exists
        try {
            await axios.get(`https://api.github.com/repos/${repo}/contents/content/creations/.gitkeep?ref=${branch}`, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('Creating .gitkeep in content/creations');
                const gitkeepContent = Buffer.from('').toString('base64');
                await axios.put(
                    `https://api.github.com/repos/${repo}/contents/content/creations/.gitkeep`,
                    {
                        message: 'Add .gitkeep to content/creations',
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
            } else {
                throw error;
            }
        }

        // Create file in GitHub repo
        const path = `content/creations/submission-${submissionId}.md`;
        try {
            const controllerGitHub = new AbortController();
            const timeoutGitHub = setTimeout(() => controllerGitHub.abort(), 8000);
            await axios.put(
                `https://api.github.com/repos/${repo}/contents/${path}`,
                {
                    message: `New creation submission: ${title}`,
                    content: base64Content,
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
            console.log('File created in GitHub submissions branch', { path });
        } catch (githubError) {
            console.log('GitHub API error', {
                message: githubError.message,
                response: githubError.response?.data
            });
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to create file in GitHub repo',
                    details: githubError.message,
                    response: githubError.response?.data
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission successful, pending review' }),
        };
    } catch (error) {
        console.log('Server error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', details: error.message, stack: error.stack }),
        };
    }
};