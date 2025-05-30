const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

// Mock CMS data (replace with actual Netlify CMS/GitHub API in production)
let mockCmsSubmissions = [];

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: '',
      };
    }

    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header:', authHeader);
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Unauthorized: Missing or invalid token' }),
      };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      console.error('Failed to decode token:', token);
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Unauthorized: Invalid token format' }),
      };
    }
    console.log('Decoded token payload:', decoded.payload);

    if (!Array.isArray(decoded.payload.aud) || !decoded.payload.aud.includes('https://artistictoolshub.com/api')) {
      console.error('Invalid audience in token:', decoded.payload.aud);
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Unauthorized: Invalid audience' }),
      };
    }

    if (event.httpMethod === 'GET') {
      // Mock CMS fetch (replace with GitHub API or Netlify CMS)
      const submissions = mockCmsSubmissions.map(sub => ({
        id: sub.submission_id,
        url: sub.image || '',
        created_at: sub.date,
        status: sub.status || 'pending',
        text: sub.text || '',
        social_links: sub.author || ''
      }));
      console.log('Fetched submissions:', { count: submissions.length });
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(submissions),
      };
    }

    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = JSON.parse(event.body);
      } catch (error) {
        console.error('JSON parse error in POST:', error);
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Invalid request body' }),
        };
      }
      const { id, action } = body;
      if (!id || !['approve', 'decline'].includes(action)) {
        console.error('Invalid POST data:', { id, action });
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Invalid action or ID' }),
        };
      }
      // Update CMS (mock)
      const submission = mockCmsSubmissions.find(s => s.submission_id === id);
      if (!submission) {
        console.error('Submission not found:', id);
        return {
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Submission not found' }),
        };
      }
      submission.status = action;
      console.log('Updated submission status:', { id, action });

      // Update Cloudinary status if image exists
      if (submission.public_id) {
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
          console.error('CLOUDINARY_API_SECRET is not set');
          return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Server error: Missing Cloudinary API secret' }),
          };
        }
        cloudinary.config({
          cloud_name: 'drxmkv1si',
          api_key: '874188631367555',
          api_secret: apiSecret,
          secure: true,
        });
        try {
          await cloudinary.api.update(submission.public_id, {
            context: { custom: { status: action } }
          });
          console.log('Cloudinary status updated:', { public_id: submission.public_id, action });
        } catch (cloudinaryError) {
          console.error('Cloudinary update error:', cloudinaryError.message || cloudinaryError);
        }
      }

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: `${action}ed submission ${id}` }),
      };
    }

    if (event.httpMethod === 'DELETE') {
      let body;
      try {
        body = JSON.parse(event.body);
      } catch (error) {
        console.error('JSON parse error in DELETE:', error);
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Invalid request body' }),
        };
      }
      const { id } = body;
      if (!id) {
        console.error('Invalid DELETE data:', { id });
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Invalid ID' }),
        };
      }
      // Delete from CMS (mock)
      const submissionIndex = mockCmsSubmissions.findIndex(s => s.submission_id === id);
      if (submissionIndex === -1) {
        console.error('Submission not found:', id);
        return {
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Submission not found' }),
        };
      }
      const submission = mockCmsSubmissions[submissionIndex];
      mockCmsSubmissions.splice(submissionIndex, 1);
      console.log('Deleted submission from CMS:', { id });

      // Delete from Cloudinary if image exists
      if (submission.public_id) {
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
          console.error('CLOUDINARY_API_SECRET is not set');
          return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Server error: Missing Cloudinary API secret' }),
          };
        }
        cloudinary.config({
          cloud_name: 'drxmkv1si',
          api_key: '874188631367555',
          api_secret: apiSecret,
          secure: true,
        });
        try {
          await cloudinary.uploader.destroy(submission.public_id);
          console.log('Cloudinary delete success:', { public_id: submission.public_id });
        } catch (cloudinaryError) {
          console.error('Cloudinary delete error:', cloudinaryError.message || cloudinaryError);
        }
      }

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: `Deleted submission ${id}` }),
      };
    }

    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  } catch (error) {
    console.error('Error in manage-submissions:', error.message || error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: `Server error: ${error.message || 'Unknown error'}` }),
    };
  }
};