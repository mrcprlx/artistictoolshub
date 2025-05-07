function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const lumR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const lumG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const lumB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function adjustColor(hex, amount) {
    const rgb = hexToRgb(hex);
    const r = Math.min(255, Math.max(0, rgb.r + amount));
    const g = Math.min(255, Math.max(0, rgb.g + amount));
    const b = Math.min(255, Math.max(0, rgb.b + amount));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function checkContrast() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const resultsDiv = document.getElementById('contrast-results');

    // Calculate luminance for both colors
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    // Calculate contrast ratio
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG guidelines: AA (4.5:1 normal, 3:1 large), AAA (7:1 normal, 4.5:1 large)
    const passesAANormal = contrastRatio >= 4.5 ? "Pass" : "Fail";
    const passesAALarge = contrastRatio >= 3 ? "Pass" : "Fail";
    const passesAAANormal = contrastRatio >= 7 ? "Pass" : "Fail";
    const passesAAALarge = contrastRatio >= 4.5 ? "Pass" : "Fail";

    // Suggest adjustments if contrast fails
    let suggestion = '';
    if (contrastRatio < 7) {
        const darkerColor = lum1 < lum2 ? color1 : color2;
        const lighterColor = lum1 < lum2 ? color2 : color1;
        const adjustedDarker = adjustColor(darkerColor, -20);
        const adjustedLighter = adjustColor(lighterColor, 20);
        suggestion = `
            <p><strong>Suggestion:</strong> Try darkening one color to ${adjustedDarker} or lightening the other to ${adjustedLighter}.</p>
        `;
    }

    resultsDiv.innerHTML = `
        <h3>Contrast Ratio: ${contrastRatio.toFixed(2)}:1</h3>
        <h4>WCAG AA</h4>
        <p>Normal Text (4.5:1): <strong>${passesAANormal}</strong></p>
        <p>Large Text (3:1): <strong>${passesAALarge}</strong></p>
        <h4>WCAG AAA</h4>
        <p>Normal Text (7:1): <strong>${passesAAANormal}</strong></p>
        <p>Large Text (4.5:1): <strong>${passesAAALarge}</strong></p>
        ${suggestion}
        <div style="background-color: ${color1}; color: ${color2}; padding: 10px; font-size: 16px;">
            Sample Normal Text (16px)
        </div>
        <div style="background-color: ${color1}; color: ${color2}; padding: 10px; font-size: 24px;">
            Sample Large Text (24px)
        </div>
    `;
}