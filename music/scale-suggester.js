async function suggestScale() {
    const keySelect = document.getElementById('key-select');
    const moodSelect = document.getElementById('mood-select');
    const selectedKey = keySelect.value;
    const selectedMood = moodSelect.value;
    const resultsDiv = document.getElementById('scale-results');
    resultsDiv.innerHTML = 'Suggesting...';

    try {
        const response = await fetch('scales.json');
        const scales = await response.json();
        const matchingScale = scales.find(scale => scale.key === selectedKey && scale.mood === selectedMood);
        
        if (matchingScale) {
            resultsDiv.innerHTML = `
                <h3>${matchingScale.scale}</h3>
                <p><strong>Notes:</strong> ${matchingScale.notes}</p>
                <p><strong>Description:</strong> ${matchingScale.description}</p>
            `;
        } else {
            resultsDiv.innerHTML = '<p>No scale found for this key and mood combination.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching scales. Please try again.</p>';
        console.error('Error:', error);
    }
}