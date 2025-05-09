async function generateTheme() {
    const resultsDiv = document.getElementById('theme-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('themes.json');
        const data = await response.json();
        const theme = data.themes[Math.floor(Math.random() * data.themes.length)];
        const emotion = data.emotions[Math.floor(Math.random() * data.emotions.length)];
        const setting = data.settings[Math.floor(Math.random() * data.settings.length)];
        resultsDiv.innerHTML = `
            <h3>${theme}, ${emotion} in ${setting}</h3>
            <p><strong>Idea:</strong> Write a song about ${theme.toLowerCase()} filled with ${emotion.toLowerCase()}, set in ${setting.toLowerCase()}.</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching themes. Please try again.</p>';
        console.error('Error:', error);
    }
}