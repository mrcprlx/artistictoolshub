const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        console.log('Starting submit-creation function');
        // Parse request body
        const { title, text, image, author, 'g-recaptcha-response': recaptchaResponse } = JSON.parse(event.body);

        // Validate inputs
        if (!title || !text || !recaptchaResponse) {
            console.log('Missing required fields');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: title, text, or reCAPTCHA response' }),
            };
        }
        if (title.length > 100) {
            console.log('Title exceeds 100 characters');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Title exceeds 100 characters' }),
            };
        }
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount > 500) {
            console.log('Text exceeds 500 words');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Text exceeds 500 words' }),
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

        // Store submission in Netlify Forms
        console.log('Submitting to Netlify Forms');
        const formSubmission = {
            form_name: 'creation-submission',
            title,
            text,
            image: imageUrl,
            creator: author || '',
            submission_id: uuidv4(),
            published: false
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(formSubmission)) {
            formData.append(key, value);
        }

        const controllerForm = new AbortController();
        const timeoutIdForm = setTimeout(() => controllerForm.abort(), 5000); // 5s timeout
        const netlifyResponse = await fetch('https://artistictoolshub.com/.netlify/functions/submit-creation', {
            method: 'POST',
            body: formData,
            signal: controllerForm.signal
        });
        clearTimeout(timeoutIdForm);

        if (!netlifyResponse.ok) {
            console.log('Netlify Forms submission failed:', await netlifyResponse.text());
            return {
                statusCode: netlifyResponse.status,
                body: JSON.stringify({ message: 'Failed to submit to Netlify Forms' }),
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