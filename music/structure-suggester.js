async function generateStructure() {
    const resultsDiv = document.getElementById('structure-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('structures.json');
        const structures = await response.json();
        const randomStructure = structures[Math.floor(Math.random() * structures.length)];
        resultsDiv.innerHTML = `
            <h3>${randomStructure.structure}</h3>
            <p><strong>Description:</strong> ${randomStructure.description}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching structures. Please try again.</p>';
        console.error('Error:', error);
    }
}