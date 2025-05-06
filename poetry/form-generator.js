window.generateForm = function () {
    const form = document.getElementById('form-select').value;
    const resultsDiv = document.getElementById('form-results');

    try {
        const forms = {
            haiku: {
                name: 'Haiku',
                template: `
                    <p><strong>Haiku Template</strong></p>
                    <p>Line 1: 5 syllables</p>
                    <p>Line 2: 7 syllables</p>
                    <p>Line 3: 5 syllables</p>
                    <p><em>Example:</em></p>
                    <p>Whispering soft winds<br>
                    Ancient trees reach for the sky<br>
                    Earth’s heartbeat echoes</p>
                `
            },
            sonnet: {
                name: 'Sonnet (Shakespearean)',
                template: `
                    <p><strong>Shakespearean Sonnet Template</strong></p>
                    <p>14 lines, iambic pentameter</p>
                    <p>Rhyme scheme: ABAB CDCD EFEF GG</p>
                    <p>Structure:</p>
                    <ul>
                        <li>Quatrain 1: Introduce theme (4 lines, ABAB)</li>
                        <li>Quatrain 2: Develop theme (4 lines, CDCD)</li>
                        <li>Quatrain 3: Twist or complication (4 lines, EFEF)</li>
                        <li>Couplet: Resolution (2 lines, GG)</li>
                    </ul>
                    <p><em>Example opening:</em></p>
                    <p>Shall I compare thee to a summer’s day? (A)<br>
                    Thou art more lovely and more temperate: (B)</p>
                `
            },
            villanelle: {
                name: 'Villanelle',
                template: `
                    <p><strong>Villanelle Template</strong></p>
                    <p>19 lines, 5 tercets + 1 quatrain</p>
                    <p>Refrains: Line 1 (A1), Line 3 (A2)</p>
                    <p>Rhyme scheme: A1BA2 A1BA A1BA A1BA A1BA A1BA2</p>
                    <p>Structure:</p>
                    <ul>
                        <li>Line 1 (A1): First refrain, repeats in lines 6, 12, 18</li>
                        <li>Line 3 (A2): Second refrain, repeats in lines 9, 15, 19</li>
                    </ul>
                    <p><em>Example opening:</em></p>
                    <p>Do not go gentle into that good night (A1)<br>
                    Old age should burn and rave at close of day; (B)<br>
                    Rage, rage against the dying of the light. (A2)</p>
                `
            }
        };

        if (forms[form]) {
            resultsDiv.innerHTML = forms[form].template;
        } else {
            resultsDiv.innerHTML = '<p>Please select a valid form.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error generating form. Please try again.</p>';
        console.error('Form Generator Error:', error);
    }
}