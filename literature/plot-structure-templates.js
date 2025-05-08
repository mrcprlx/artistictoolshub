async function loadStructure() {
    const structureSelect = document.getElementById('structure-select').value;
    const resultsDiv = document.getElementById('structure-results');
    resultsDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch('plot-structures.json');
        const structures = await response.json();
        const structure = structures.find(s => s.structure === structureSelect);

        let html = `<h3>${structure.structure}</h3>`;
        structure.stages.forEach(stage => {
            html += `
                <div class="stage-entry">
                    <h4>${stage.stage}</h4>
                    <p>${stage.description}</p>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching plot structures. Please try again.</p>';
        console.error('Error:', error);
    }
}