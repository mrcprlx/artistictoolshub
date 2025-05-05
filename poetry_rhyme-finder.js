async function findRhymes() {
    const input = document.getElementById('rhyme-input').value.trim();
    const resultsDiv = document.getElementById('rhyme-results');

    if (!input) {
        resultsDiv.innerHTML = '<p>Please enter a word.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(input)}`);
        const data = await response.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = '<p>No rhymes found. Try another word!</p>';
            return;
        }

        const rhymes = data.map(item => item.word).slice(0, 10); // Limit to 10 results
        resultsDiv.innerHTML = `<p>Rhymes for "${input}":</p><ul>${rhymes.map(word => `<li>${word}</li>`).join('')}</ul>`;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching rhymes. Please try again later.</p>';
        console.error('Error:', error);
    }
}