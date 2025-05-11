let dictionary = [];
let dictionaryLoaded = false;

// Load cmudict.json with retries (same as analyzer.js)
async function loadDictionary() {
    const cached = localStorage.getItem('cmudict');
    if (cached) {
        try {
            dictionary = JSON.parse(cached);
            dictionaryLoaded = true;
            console.log(`Loaded cmudict.json with ${dictionary.length} entries`);
            return;
        } catch (e) {
            console.error('Failed to parse cached cmudict:', e);
        }
    }

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('./cmudict.json');
            if (!response.ok) {
                throw new Error(`Failed to load cmudict.json: ${response.status}`);
            }
            const data = await response.json();
            dictionary = data;
            dictionaryLoaded = true;
            console.log(`Loaded cmudict.json with ${dictionary.length} entries (attempt ${attempt})`);
            localStorage.setItem('cmudict', JSON.stringify(data));
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === maxRetries) {
                dictionaryLoaded = false;
                console.error('All fetch attempts failed; using syllable library fallback');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDictionary();
});

window.countSyllables = async function () {
    const input = document.getElementById('syllable-input').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('syllable-results');

    if (!input) {
        resultsDiv.innerHTML = '<p>Please enter a word or phrase.</p>';
        return;
    }

    // Wait for dictionary to load (up to 10 seconds)
    if (!dictionaryLoaded) {
        for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (dictionaryLoaded) break;
        }
        if (!dictionaryLoaded) {
            resultsDiv.innerHTML += '<p class="warning">Warning: Syllable dictionary not loaded. Using syllable library fallback.</p>';
        }
    }

    try {
        const words = input.split(/\s+/);
        let totalSyllables = 0;

        words.forEach(word => {
            word = word.replace(/[.,!?]/g, ''); // Remove punctuation
            if (!word) return;

            let syllables = 0;
            // Check cmudict.json first
            if (dictionaryLoaded && dictionary.length > 0) {
                const entry = dictionary.find(item => item.text.toLowerCase() === word);
                if (entry) {
                    syllables = entry.stress.length;
                    console.log(`Word: ${word}, Syllables: ${syllables} (cmudict)`);
                    totalSyllables += syllables;
                    return;
                }
            }
            // Fallback to syllable library
            try {
                syllables = window.syllable(word);
                console.log(`Word: ${word}, Syllables: ${syllables} (syllable library)`);
                totalSyllables += syllables;
            } catch (error) {
                console.error(`Error counting syllables for ${word}:`, error);
                syllables = 1; // Default to 1 if library fails
                console.log(`Word: ${word}, Syllables: 1 (default)`);
                totalSyllables += syllables;
            }
        });

        resultsDiv.innerHTML = `<p>Syllable count for "${input}": ${totalSyllables}</p>`;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error counting syllables. Please try again.</p>';
        console.error('Syllable Counter Error:', error);
    }
};