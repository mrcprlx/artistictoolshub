async function generateName() {
    const cultureSelect = document.getElementById('culture-select').value;
    const genderSelect = document.getElementById('gender-select').value;
    const resultsDiv = document.getElementById('name-results');
    resultsDiv.innerHTML = 'Generating...';

    try {
        const response = await fetch('names.json');
        const data = await response.json();
        const culture = data.cultures.find(c => c.culture === cultureSelect);

        const firstNames = culture.firstNames[genderSelect.toLowerCase()];
        const lastNames = culture.lastNames;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        resultsDiv.innerHTML = `
            <h3>Generated Name</h3>
            <p>${fullName}</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching names. Please try again.</p>';
        console.error('Error:', error);
    }
}