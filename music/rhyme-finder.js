async function findRhymes() {
    const inputWord = document.getElementById('rhyme-input').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('rhyme-results');
    resultsDiv.innerHTML = 'Searching...';

    if (!inputWord) {
        resultsDiv.innerHTML = '<p>Please enter a word to find rhymes.</p>';
        return;
    }

    try {
        const response = await fetch('rhymes.json');
        const rhymeGroups = await response.json();

        let matchingGroup = null;
        for (const group of rhymeGroups) {
            if (group.words.includes(inputWord)) {
                matchingGroup = group;
                break;
            }
            const ending = inputWord.slice(-3); // Check last 3 letters for potential rhyme
            if (group.ending === `-${ending}`) {
                matchingGroup = group;
                break;
            }
        }

        if (matchingGroup) {
            const rhymes = matchingGroup.words.filter(word => word !== inputWord);
            if (rhymes.length > 0) {
                resultsDiv.innerHTML = `
                    <h3>Rhymes for "${inputWord}"</h3>
                    <p>${rhymes.join(', ')}</p>
                `;
            } else {
                resultsDiv.innerHTML = '<p>No rhymes found for this word.</p>';
            }
        } else {
            resultsDiv.innerHTML = '<p>No rhymes found. Try another word!</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching rhymes. Please try again.</p>';
        console.error('Error:', error);
    }
}