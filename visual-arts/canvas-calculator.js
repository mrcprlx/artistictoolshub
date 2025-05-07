async function calculateCanvasSize() {
    const sizeSelect = document.getElementById('size-select');
    const dpiInput = document.getElementById('dpi-input');
    const resultsDiv = document.getElementById('canvas-results');

    const selectedSize = sizeSelect.value;
    const dpi = parseInt(dpiInput.value) || 300; // Default to 300 DPI if invalid

    try {
        const response = await fetch('canvas-sizes.json');
        const sizes = await response.json();
        const sizeData = sizes.find(size => size.size === selectedSize);

        if (sizeData) {
            const widthPixels = Math.round(sizeData.widthInches * dpi);
            const heightPixels = Math.round(sizeData.heightInches * dpi);
            resultsDiv.innerHTML = `
                <h3>${selectedSize} at ${dpi} DPI</h3>
                <p>Width: ${widthPixels} pixels</p>
                <p>Height: ${heightPixels} pixels</p>
            `;
        } else {
            resultsDiv.innerHTML = '<p>Size not found.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error fetching canvas sizes. Please try again.</p>';
        console.error('Error:', error);
    }
}