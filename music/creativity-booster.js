async function boostCreativity() {
    const resultsDiv = document.getElementById('strategy-results');
    resultsDiv.innerHTML = 'Thinking...';

    try {
        const response = await fetch('strategies.json');
        const strategies = await response.json();
        const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
        resultsDiv.innerHTML = `
            <h3>Creative Prompt</h3>
            <p>${randomStrategy.strategy}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching strategies. Please try again.</p>';
        console.error('Error:', error);
    }
}