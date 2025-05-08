async function loadSymbols() {
    const resultsDiv = document.getElementById('symbol-results');
    resultsDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch('symbols.json');
        const symbols = await response.json();
        let html = '<h3>Common Symbols</h3>';
        symbols.forEach(symbol => {
            html += `
                <div class="symbol-entry">
                    <h4>${symbol.symbol}</h4>
                    <p><strong>Meaning:</strong> ${symbol.meaning}</p>
                    <p><strong>Example:</strong> ${symbol.example}</p>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching symbols. Please try again.</p>';
        console.error('Error:', error);
    }
}