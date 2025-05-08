async function loadDevices() {
    const resultsDiv = document.getElementById('device-results');
    resultsDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch('literary-devices.json');
        const devices = await response.json();
        let html = '<h3>Literary Devices</h3>';
        devices.forEach(device => {
            html += `
                <div class="device-entry">
                    <h4>${device.device}</h4>
                    <p><strong>Definition:</strong> ${device.definition}</p>
                    <p><strong>Example:</strong> ${device.example}</p>
                </div>
            `;
        });
        resultsDiv.innerHTML = html;
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching literary devices. Please try again.</p>';
        console.error('Error:', error);
    }
}