const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

    // Validate reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${encodeURIComponent(recaptchaResponse)}`,
    });
    const recaptchaData = await recaptchaVerify.json();
    if (!recaptchaData.success) {
        return { statusCode: 400, body: JSON.stringify({ message: 'reCAPTCHA verification failed' }) };
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'artistictoolshub');
        const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/drxmkv1si/image/upload', formData);
        imageUrl = cloudinaryResponse.data.secure_url;
    }

    // Create draft entry in GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'mrcprlx'; // Replace with your GitHub username/organization
    const repoName = 'artistictoolshub';   // Replace with your repository name
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

    return { statusCode: 200, body: JSON.stringify({ message: 'Submission successful, pending review' }) };
};