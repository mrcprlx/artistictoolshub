async function generateFirstLine() {
    const resultsDiv = document.getElementById('line-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('first-lines.json');
        const lines = await response.json();
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        resultsDiv.innerHTML = `
            <h3>First Line</h3>
            <p>${randomLine.line}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching first lines. Please try again.</p>';
        console.error('Error:', error);
    }
}