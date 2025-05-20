exports.handler = async () => {
    try {
        // Placeholder: Return mock data (replace with CMS fetch in production)
        const creations = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            text: `Sample creation ${i + 1}. This is a snippet of creative work shared by an artist.`,
            image: i % 2 === 0 ? 'https://via.placeholder.com/150' : null,
            author: i % 3 === 0 ? 'Artist' : i % 3 === 1 ? 'https://x.com/artist' : null,
            date: new Date(2025, 4, 19 - i).toISOString(),
        }));

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(creations),
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error: ' + error.message }),
        };
    }
};