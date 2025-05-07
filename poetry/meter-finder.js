async function findMeterWords() {
    const select = document.getElementById('meter-select');
    const pattern = select.value;
    const resultsDiv = document.getElementById('meter-results');
    resultsDiv.innerHTML = 'Searching...';

    try {
        const response = await fetch('cmudict.json');
        const words = await response.json();
        const matches = words.filter(word => word.stress === pattern).map(word => word.text);

        if (matches.length > 0) {
            resultsDiv.innerHTML = `<p>Words matching pattern: ${matches.join(', ')}</p>`;
        } else {
            resultsDiv.innerHTML = '<p>No words found for this pattern.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching words. Please try again.</p>';
        console.error('Error:', error);
    }
}