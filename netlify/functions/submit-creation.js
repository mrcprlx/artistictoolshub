const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

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
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount > 500) {
            console.log('Text exceeds 500 words', { wordCount });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Text exceeds 500 words' }),
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${encodeURIComponent(recaptchaResponse)}`,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const recaptchaData = await recaptchaVerify.json();
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
            try {
                console.log('Uploading image to Cloudinary');
                const formData = new FormData();
                formData.append('file', `data:image/jpeg;base64,${image}`);
                formData.append('upload_preset', 'artistictoolshub');

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const cloudinaryResponse = await axios.post(
                    'https://api.cloudinary.com/v1_1/drxmkv1si/image/upload',
                    formData,
                    { headers: formData.getHeaders(), signal: controller.signal }
                );
                clearTimeout(timeoutId);

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

        // Store submission in Netlify Forms
        console.log('Preparing Netlify Forms submission');
        const formSubmission = {
            'form-name': 'creation-submission',
            title,
            text,
            image: imageUrl,
            creator: author || '',
            submission_id: uuidv4(),
            published: 'false'
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(formSubmission)) {
            formData.append(key, value);
        }

        console.log('Submission prepared, returning success');
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