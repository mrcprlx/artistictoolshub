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
        // Check if the word exists in any group
        for (const group of rhymeGroups) {
            if (group.words.includes(inputWord)) {
                matchingGroup = group;
                break;
            }
        }

        // If not found, try matching by ending (last 2, 3, or 4 letters)
        if (!matchingGroup) {
            for (let len = 2; len <= 4; len++) {
                const ending = inputWord.slice(-len);
                matchingGroup = rhymeGroups.find(group => group.ending === `-${ending}`);
                if (matchingGroup) break;
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
            resultsDiv.innerHTML = `<p>No rhymes found for "${inputWord}". Try a different word, or it might not be in our rhyme database yet!</p>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching rhymes. Please try again.</p>';
        console.error('Error:', error);
    }
}