// Mock CMS data (replace with actual Netlify CMS/GitHub API in production)
let mockCmsSubmissions = [];

exports.handler = async () => {
  try {
    console.log('Function invoked: get-creations');

    // Fetch approved submissions from CMS
    const creations = mockCmsSubmissions
      .filter(sub => sub.status === 'approve')
      .map(sub => ({
        id: sub.submission_id,
        text: sub.text || '',
        image: sub.image || null,
        author: sub.author || null,
        date: sub.date
      }));

    console.log('Fetched creations:', { count: creations.length });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(creations),
    };
  } catch (error) {
    console.error('Function error in get-creations:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Server error: ' + error.message }),
    };
  }
};