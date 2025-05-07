async function generatePalette() {
    const moodSelect = document.getElementById('mood-select');
    const selectedMood = moodSelect.value;
    const resultsDiv = document.getElementById('palette-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('palettes.json');
        const palettes = await response.json();
        const matchingPalettes = palettes.filter(palette => palette.mood === selectedMood);
        if (matchingPalettes.length === 0) {
            resultsDiv.innerHTML = '<p>No palettes found for this mood.</p>';
            return;
        }
        const randomPalette = matchingPalettes[Math.floor(Math.random() * matchingPalettes.length)];
        const colorSwatches = randomPalette.colors.map(color => `
            <div style="background-color: ${color}; width: 50px; height: 50px; display: inline-block; margin-right: 10px;"></div>
            <span>${color}</span><br>
        `).join('');
        resultsDiv.innerHTML = `
            <h3>${randomPalette.mood} Palette</h3>
            <p>${randomPalette.description}</p>
            <div>${colorSwatches}</div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching palettes. Please try again.</p>';
        console.error('Error:', error);
    }
}