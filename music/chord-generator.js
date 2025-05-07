async function generateChordProgression() {
    const resultsDiv = document.getElementById('chord-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('chords.json');
        const progressions = await response.json();
        const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
        resultsDiv.innerHTML = `
            <h3>${randomProgression.progression}</h3>
            <p><strong>Example:</strong> ${randomProgression.example}</p>
            <p><strong>Description:</strong> ${randomProgression.description}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching progressions. Please try again.</p>';
        console.error('Error:', error);
    }
}