function calculateReadability() {
    const textInput = document.getElementById('text-input').value;
    const resultsDiv = document.getElementById('readability-results');

    if (!textInput.trim()) {
        resultsDiv.innerHTML = '<p>Please enter some text to analyze.</p>';
        return;
    }

    // Basic text analysis
    const words = textInput.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const sentences = textInput.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;
    let syllableCount = 0;

    words.forEach(word => {
        // Approximate syllables: count vowels, adjust for common patterns
        let vowels = word.match(/[aeiouy]+/gi);
        let syllables = vowels ? vowels.length : 1;
        if (word.endsWith('e')) syllables--; // Silent 'e'
        syllableCount += Math.max(1, syllables);
    });

    // Flesch-Kincaid Grade Level
    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / wordCount;
    const fkGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

    resultsDiv.innerHTML = `
        <h3>Readability Results</h3>
        <p><strong>Flesch-Kincaid Grade Level:</strong> ${fkGrade.toFixed(1)}</p>
        <p>(Suitable for grade level ${Math.round(fkGrade)} readers)</p>
        <p><strong>Word Count:</strong> ${wordCount}</p>
        <p><strong>Sentence Count:</strong> ${sentenceCount}</p>
    `;
}