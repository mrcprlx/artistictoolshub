function generateGradient() {
    const colors = [
        document.getElementById('color1').value,
        document.getElementById('color2').value,
        document.getElementById('color3').value || null,
        document.getElementById('color4').value || null,
        document.getElementById('color5').value || null
    ].filter(color => color !== null);

    const gradientType = document.getElementById('gradient-type').value;
    const direction = document.getElementById('gradient-direction').value;
    const gradientPreview = document.getElementById('gradient-preview');
    const cssOutput = document.getElementById('css-output');

    if (colors.length < 2) {
        gradientPreview.style.background = '#f0f0f0';
        cssOutput.textContent = 'Please select at least two colors.';
        return;
    }

    // Construct the gradient string based on type and direction
    let gradientStyle;
    if (gradientType === 'linear') {
        gradientStyle = `linear-gradient(${direction}, ${colors.join(', ')})`;
    } else if (gradientType === 'radial') {
        gradientStyle = `radial-gradient(circle, ${colors.join(', ')})`;
    } else if (gradientType === 'diagonal') {
        gradientStyle = `linear-gradient(45deg, ${colors.join(', ')})`;
    }

    // Apply the gradient to the preview
    gradientPreview.style.background = gradientStyle;

    // Generate and display the CSS code
    const cssCode = `background: ${gradientStyle};`;
    cssOutput.textContent = cssCode;

    // Enable copying the CSS code
    cssOutput.onclick = function () {
        navigator.clipboard.writeText(cssCode).then(() => {
            alert('CSS code copied to clipboard!');
        });
    };
}