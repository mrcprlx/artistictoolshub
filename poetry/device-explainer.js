async function explainDevice() {
    const input = document.getElementById('device-input').value.toLowerCase();
    const resultsDiv = document.getElementById('device-results');
    resultsDiv.innerHTML = 'Searching...';

    const devices = {
        metaphor: {
            definition: "A figure of speech comparing two unlike things without using like or as.",
            example: "Her eyes were stars shining in the night."
        },
        alliteration: {
            definition: "Repetition of initial consonant sounds in nearby words.",
            example: "Peter Piper picked a peck of pickled peppers."
        },
        simile: {
            definition: "A comparison using like or as.",
            example: "Her smile was like sunshine on a cloudy day."
        }
        // Add more terms as needed
    };

    if (devices[input]) {
        const { definition, example } = devices[input];
        resultsDiv.innerHTML = `<p><strong>${input.charAt(0).toUpperCase() + input.slice(1)}</strong>: ${definition}</p><p>Example: ${example}</p>`;
    } else {
        resultsDiv.innerHTML = '<p>Term not found. Try another term.</p>';
    }
}