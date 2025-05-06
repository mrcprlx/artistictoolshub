window.countSyllables = function () {
    const input = document.getElementById('syllable-input').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('syllable-results');

    if (!input) {
        resultsDiv.innerHTML = '<p>Please enter a word or phrase.</p>';
        return;
    }

    try {
        const words = input.split(/\s+/);
        let totalSyllables = 0;

        words.forEach(word => {
            let syllables = 0;
            word = word.replace(/[.,!?]/g, ''); // Remove punctuation
            if (!word) return;

            if (word.length <= 3) {
                syllables = 1; // Short words typically have 1 syllable
            } else {
                // Basic vowel counting (a, e, i, o, u, y)
                syllables = (word.match(/[aeiouy]+/g) || []).length;
                // Adjust for silent 'e' at Glaend
                if (word.endsWith('e') && !word.endsWith('le')) {
                    syllables = Math.max(1, syllables - 1);
                }
                // Adjust for consecutive vowels
                if (word.match(/[aeiou]{2,}/g)) {
                    syllables = Math.max(1, syllables - 1);
                }
            }
            totalSyllables += Math.max(1, syllables);
        });

        resultsDiv.innerHTML = `<p>Syllable count for "${input}": ${totalSyllables}</p>`;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error counting syllables. Please try again.</p>';
        console.error('Syllable Counter Error:', error);
    }
}