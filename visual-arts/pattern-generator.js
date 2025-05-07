function generatePattern() {
    const canvas = document.getElementById('pattern-canvas');
    const ctx = canvas.getContext('2d');
    const patternType = document.getElementById('pattern-type').value;
    const color1 = document.getElementById('pattern-color1').value;
    const color2 = document.getElementById('pattern-color2').value;
    const size = parseInt(document.getElementById('pattern-size').value) || 20;
    const spacing = parseInt(document.getElementById('pattern-spacing').value) || 10;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a background with color2
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the pattern with color1
    ctx.fillStyle = color1;
    ctx.strokeStyle = color1;
    ctx.lineWidth = 2;

    if (patternType === 'stripes') {
        for (let x = 0; x < canvas.width; x += (size + spacing) * 2) {
            ctx.fillRect(x, 0, size, canvas.height);
        }
    } else if (patternType === 'dots') {
        for (let x = size; x < canvas.width; x += size + spacing) {
            for (let y = size; y < canvas.height; y += size + spacing) {
                ctx.beginPath();
                ctx.arc(x, y, size / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (patternType === 'grid') {
        for (let x = 0; x < canvas.width; x += size + spacing) {
            for (let y = 0; y < canvas.height; y += size + spacing) {
                ctx.strokeRect(x, y, size, size);
            }
        }
    } else if (patternType === 'chevrons') {
        for (let y = 0; y < canvas.height; y += size + spacing) {
            for (let x = 0; x < canvas.width; x += (size + spacing) * 2) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x + size * 2, y);
                ctx.stroke();
            }
        }
    } else if (patternType === 'waves') {
        for (let y = 0; y < canvas.height; y += size + spacing) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += size / 2) {
                let offset = Math.sin(x * 0.05) * (size / 2);
                if (x === 0) ctx.moveTo(x, y + offset);
                else ctx.lineTo(x, y + offset);
            }
            ctx.stroke();
        }
    } else if (patternType === 'hexagons') {
        const hexSize = size / 2;
        const hexHeight = hexSize * Math.sqrt(3);
        for (let y = 0; y < canvas.height; y += hexHeight + spacing) {
            for (let x = 0; x < canvas.width; x += (hexSize * 3) + spacing) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const px = x + hexSize * Math.cos(angle) + (y % 2 === 0 ? 0 : hexSize * 1.5);
                    const py = y + hexSize * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

function initCanvas() {
    const canvas = document.getElementById('pattern-canvas');
    canvas.width = 400;
    canvas.height = 400;
    generatePattern();
}