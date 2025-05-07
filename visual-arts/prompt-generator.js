async function generatePrompt() {
    const resultsDiv = document.getElementById('prompt-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('prompts.json');
        const prompts = await response.json();
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        resultsDiv.innerHTML = `
            <h3>Art Prompt</h3>
            <p>${randomPrompt.prompt}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching prompts. Please try again.</p>';
        console.error('Error:', error);
    }
}