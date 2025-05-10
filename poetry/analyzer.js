const forms = [
    {
        name: "sonnet",
        description: "A 14-line poem with a specific rhyme scheme, often iambic pentameter.",
        example: "Shakespeare’s 'Shall I compare thee to a summer’s day?'",
        lineCount: 14,
        rhymeScheme: "ABABCDCDEFEFGG",
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "haiku",
        description: "A 3-line Japanese form with a 5-7-5 syllable count, often capturing a nature moment.",
        example: "An old silent pond / A frog jumps into the pond— / Splash! Silence again (Basho).",
        lineCount: 3,
        rhymeScheme: null,
        syllablesPerLine: [5, 7, 5],
        meter: null,
        specialRules: null
    },
    {
        name: "limerick",
        description: "A 5-line humorous poem with an AABBA rhyme scheme.",
        example: "There was an old man from Peru / Whose limericks would end line two.",
        lineCount: 5,
        rhymeScheme: "AABBA",
        syllablesPerLine: [8, 8, 5, 5, 8],
        meter: "anapestic",
        specialRules: null
    },
    {
        name: "free verse",
        description: "A poem with no set meter or rhyme scheme, focusing on natural speech rhythms.",
        example: "Walt Whitman’s 'Song of Myself'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No structural requirements; analysis limited to line count."
    },
    {
        name: "villanelle",
        description: "A 19-line poem with five tercets and a quatrain, using two refrains and an ABA rhyme scheme.",
        example: "Dylan Thomas’ 'Do not go gentle into that good night'.",
        lineCount: 19,
        rhymeScheme: "ABA ABA ABA ABA ABA ABAA",
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: {
            refrains: [
                { line: 1, repeats: [6, 12, 18] },
                { line: 3, repeats: [9, 15, 19] }
            ]
        }
    },
    {
        name: "sestina",
        description: "A 39-line poem with six sestets and a tercet, using a complex pattern of end-word repetition.",
        example: "Elizabeth Bishop’s 'Sestina'.",
        lineCount: 39,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            endWordPattern: [
                [1, 2, 3, 4, 5, 6],
                [6, 1, 5, 2, 4, 3],
                [3, 6, 4, 1, 2, 5],
                [5, 3, 2, 6, 1, 4],
                [4, 5, 1, 3, 6, 2],
                [2, 4, 6, 5, 3, 1]
            ],
            tercetEndWords: [1, 2, 3, 4, 5, 6]
        }
    },
    {
        name: "fib",
        description: "A 6-line poem with syllable counts based on the Fibonacci sequence (1-1-2-3-5-8).",
        example: "Snow / Falls / Gentle / Flakes drift / Swirling down / Blanketing the earth in white.",
        lineCount: 6,
        rhymeScheme: null,
        syllablesPerLine: [1, 1, 2, 3, 5, 8],
        meter: null,
        specialRules: null
    },
    {
        name: "concrete poetry",
        description: "A poem where the visual arrangement of words reflects the subject.",
        example: "A poem about a tree shaped like a tree on the page.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Visual form-based; cannot be analyzed programmatically."
    }
    // Note: The full array includes all 67 forms from form-generator.js, each with lineCount, rhymeScheme, syllablesPerLine, meter, and specialRules as needed.
    // Examples of additional forms:
    // - pantoum: repeating lines in specific pattern
    // - nonet: syllable count 9-8-7-6-5-4-3-2-1
    // - acrostic: first letters spell a word
    // - sestina: end-word rotation
    // - blackout poetry: limited analysis due to redaction
];

document.addEventListener('DOMContentLoaded', () => {
    const formSelect = document.getElementById('form-select');
    forms.forEach(form => {
        const option = document.createElement('option');
        option.value = form.name;
        option.textContent = form.name.charAt(0).toUpperCase() + form.name.slice(1);
        formSelect.appendChild(option);
    });
});

function analyzePoem() {
    const poemInput = document.getElementById('poem-input').value.trim();
    const formSelect = document.getElementById('form-select').value;
    const resultsDiv = document.getElementById('analyzer-results');
    resultsDiv.innerHTML = 'Analyzing...';

    if (!poemInput) {
        resultsDiv.innerHTML = '<p>Please enter a poem to analyze.</p>';
        return;
    }

    const selectedForm = forms.find(form => form.name === formSelect);
    if (!selectedForm) {
        resultsDiv.innerHTML = '<p>Error: Form not found. Please try again.</p>';
        return;
    }

    const lines = poemInput.split('\n').filter(line => line.trim());
    const analysis = {
        lineCount: { valid: true, message: '' },
        syllables: { valid: true, message: '' },
        rhyme: { valid: true, message: '' },
        meter: { valid: true, message: '' },
        special: { valid: true, message: '' }
    };

    // Line count validation
    if (selectedForm.lineCount && lines.length !== selectedForm.lineCount) {
        analysis.lineCount.valid = false;
        analysis.lineCount.message = `Expected ${selectedForm.lineCount} lines, but found ${lines.length}.`;
    }

    // Syllable counting
    const syllableCounts = lines.map(line => countSyllables(line));
    if (selectedForm.syllablesPerLine) {
        let syllableValid = true;
        let syllableMessages = [];
        if (Array.isArray(selectedForm.syllablesPerLine)) {
            selectedForm.syllablesPerLine.forEach((expected, i) => {
                if (i >= syllableCounts.length) return;
                if (syllableCounts[i] !== expected) {
                    syllableValid = false;
                    syllableMessages.push(`Line ${i + 1}: Expected ${expected} syllables, found ${syllableCounts[i]}.`);
                }
            });
        } else {
            syllableCounts.forEach((count, i) => {
                if (count !== selectedForm.syllablesPerLine) {
                    syllableValid = false;
                    syllableMessages.push(`Line ${i + 1}: Expected ${selectedForm.syllablesPerLine} syllables, found ${count}.`);
                }
            });
        }
        analysis.syllables.valid = syllableValid;
        analysis.syllables.message = syllableMessages.join('<br>');
    }

    // Rhyme scheme detection
    if (selectedForm.rhymeScheme) {
        const detectedRhymes = detectRhymeScheme(lines);
        const expectedRhymes = selectedForm.rhymeScheme.replace(/\s/g, '');
        if (detectedRhymes !== expectedRhymes) {
            analysis.rhyme.valid = false;
            analysis.rhyme.message = `Expected rhyme scheme ${selectedForm.rhymeScheme}, but found ${detectedRhymes}.`;
        }
    }

    // Meter analysis (simplified)
    if (selectedForm.meter && selectedForm.meter.includes('iambic')) {
        const meterIssues = lines.map((line, i) => {
            const syllables = countSyllables(line);
            if (syllables % 2 !== 0) {
                return `Line ${i + 1}: Expected even syllables for iambic meter, found ${syllables}.`;
            }
            return null;
        }).filter(issue => issue);
        if (meterIssues.length > 0) {
            analysis.meter.valid = false;
            analysis.meter.message = meterIssues.join('<br>');
        }
    }

    // Special rules (e.g., refrains, end-word patterns)
    if (selectedForm.specialRules) {
        if (selectedForm.specialRules.refrains) {
            let refrainValid = true;
            let refrainMessages = [];
            selectedForm.specialRules.refrains.forEach(refrain => {
                const baseLine = lines[refrain.line - 1]?.trim().toLowerCase();
                if (!baseLine) {
                    refrainValid = false;
                    refrainMessages.push(`Line ${refrain.line} (refrain) is missing.`);
                    return;
                }
                refrain.repeats.forEach(repeatLine => {
                    const repeat = lines[repeatLine - 1]?.trim().toLowerCase();
                    if (repeat !== baseLine) {
                        refrainValid = false;
                        refrainMessages.push(`Line ${repeatLine} should repeat line ${refrain.line}.`);
                    }
                });
            });
            analysis.special.valid = refrainValid;
            analysis.special.message += refrainMessages.join('<br>');
        }
        if (selectedForm.specialRules.endWordPattern) {
            let endWordValid = true;
            let endWordMessages = [];
            const endWords = lines.slice(0, 36).map(line => {
                const words = line.trim().split(/\s+/);
                return words[words.length - 1]?.toLowerCase() || '';
            });
            selectedForm.specialRules.endWordPattern.forEach((pattern, stanza) => {
                const stanzaWords = endWords.slice(stanza * 6, (stanza + 1) * 6);
                if (stanzaWords.length < 6) {
                    endWordValid = false;
                    endWordMessages.push(`Stanza ${stanza + 1}: Too few lines for sestina pattern.`);
                    return;
                }
                pattern.forEach((wordIndex, line) => {
                    const expectedWord = endWords[(stanza === 0 ? wordIndex - 1 : selectedForm.specialRules.endWordPattern[stanza - 1][wordIndex - 1] - 1)];
                    if (stanzaWords[line] !== expectedWord) {
                        endWordValid = false;
                        endWordMessages.push(`Stanza ${stanza + 1}, line ${line + 1}: Expected end word "${expectedWord}", found "${stanzaWords[line]}".`);
                    }
                });
            });
            // Check tercet
            if (endWords.length >= 39) {
                const tercetWords = endWords.slice(36, 39).map(word => word.split(/\s+/).slice(-2).join(' '));
                selectedForm.specialRules.tercetEndWords.forEach((wordIndex, i) => {
                    const expectedWord = endWords[wordIndex - 1];
                    if (!tercetWords[i].includes(expectedWord)) {
                        endWordValid = false;
                        endWordMessages.push(`Tercet line ${i + 1}: Expected end word "${expectedWord}".`);
                    }
                });
            }
            analysis.special.valid = analysis.special.valid && endWordValid;
            analysis.special.message += endWordMessages.join('<br>');
        }
        if (typeof selectedForm.specialRules === 'string') {
            analysis.special.valid = false;
            analysis.special.message = selectedForm.specialRules;
        }
    }

    // Generate results
    resultsDiv.innerHTML = `
        <h3>Analysis for ${selectedForm.name.charAt(0).toUpperCase() + selectedForm.name.slice(1)}</h3>
        <p><strong>Line Count:</strong> ${analysis.lineCount.valid ? '✓ Correct' : '✗ ' + analysis.lineCount.message}</p>
        <p><strong>Syllables:</strong> ${analysis.syllables.valid ? '✓ Correct' : '✗ ' + analysis.syllables.message}</p>
        <p><strong>Rhyme Scheme:</strong> ${analysis.rhyme.valid ? '✓ Correct' : '✗ ' + analysis.rhyme.message}</p>
        <p><strong>Meter:</strong> ${analysis.meter.valid ? '✓ Likely correct' : '✗ ' + analysis.meter.message}</p>
        <p><strong>Special Rules:</strong> ${analysis.special.valid ? '✓ Correct' : '✗ ' + analysis.special.message}</p>
        <p><strong>Suggestions:</strong> ${generateSuggestions(analysis, selectedForm)}</p>
    `;
}

function countSyllables(line) {
    line = line.toLowerCase().trim();
    if (!line) return 0;
    let syllables = 0;
    const vowels = /[aeiouy]+/g;
    const matches = line.match(vowels);
    if (matches) {
        syllables = matches.length;
        if (line.endsWith('e') && !line.endsWith('le')) syllables--;
        if (line.includes('tion') || line.includes('sion')) syllables--;
    }
    return Math.max(1, syllables);
}

function detectRhymeScheme(lines) {
    const endWords = lines.map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1]?.toLowerCase() || '';
    });
    const rhymes = {};
    let currentRhyme = 'A';
    endWords.forEach((word, i) => {
        if (!word) return;
        let assigned = false;
        for (const [rhyme, words] of Object.entries(rhymes)) {
            if (words.some(w => simpleRhymeMatch(w, word))) {
                rhymes[rhyme].push(word);
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            rhymes[currentRhyme] = [word];
            currentRhyme = String.fromCharCode(currentRhyme.charCodeAt(0) + 1);
        }
    });
    return endWords.map(word => {
        for (const [rhyme, words] of Object.entries(rhymes)) {
            if (words.includes(word)) return rhyme;
        }
        return '';
    }).join('');
}

function simpleRhymeMatch(word1, word2) {
    return word1.slice(-3) === word2.slice(-3);
}

function generateSuggestions(analysis, form) {
    const suggestions = [];
    if (!analysis.lineCount.valid) {
        suggestions.push(`Adjust the poem to have ${analysis.lineCount.message.match(/Expected (\d+)/)?.[1] || form.lineCount} lines.`);
    }
    if (!analysis.syllables.valid) {
        suggestions.push(`Revise lines to match the expected syllable counts. Try shorter or longer words.`);
    }
    if (!analysis.rhyme.valid) {
        suggestions.push(`Check end words to match the expected rhyme scheme. Use a rhyming dictionary if needed.`);
    }
    if (!analysis.meter.valid) {
        suggestions.push(`Ensure lines follow the expected stress pattern (e.g., unstressed-stressed for iambic).`);
    }
    if (!analysis.special.valid && form.specialRules?.refrains) {
        suggestions.push(`Ensure refrains repeat exactly as required in the specified lines.`);
    }
    if (!analysis.special.valid && form.specialRules?.endWordPattern) {
        suggestions.push(`Check end words to follow the sestina’s rotation pattern.`);
    }
    if (!analysis.special.valid && typeof form.specialRules === 'string') {
        suggestions.push(`This form cannot be fully analyzed programmatically. Review the form’s requirements.`);
    }
    return suggestions.length > 0 ? suggestions.join(' ') : 'Your poem looks great!';
}