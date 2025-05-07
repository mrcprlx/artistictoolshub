function drawOverlay() {
    const canvas = document.getElementById('golden-ratio-canvas');
    const ctx = canvas.getContext('2d');
    const overlayType = document.getElementById('overlay-type').value;
    const showOverlay = document.getElementById('show-overlay').checked;
    const lineColor = document.getElementById('line-color').value;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a light gray background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showOverlay) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;

        if (overlayType === 'golden-ratio') {
            // Draw the golden ratio spiral
            let x = canvas.width;
            let y = canvas.height;
            let size = Math.min(x, y) * 0.9;
            let phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
            let currentX = x * 0.5;
            let currentY = y * 0.5;
            let currentSize = size;

            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                let radius = currentSize / 2;
                let centerX = currentX + (i % 2 === 0 ? radius : -radius);
                let centerY = currentY + (i % 2 === 1 ? radius : -radius);
                let startAngle = (i * Math.PI) / 2;
                let endAngle = startAngle + Math.PI / 2;

                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                currentSize /= phi;

                if (i % 2 === 0) {
                    currentX -= currentSize;
                } else {
                    currentY -= currentSize;
                }
            }
            ctx.stroke();
        } else if (overlayType === 'rule-of-thirds') {
            // Draw rule of thirds grid
            const thirdX = canvas.width / 3;
            const thirdY = canvas.height / 3;

            ctx.beginPath();
            // Vertical lines
            ctx.moveTo(thirdX, 0);
            ctx.lineTo(thirdX, canvas.height);
            ctx.moveTo(thirdX * 2, 0);
            ctx.lineTo(thirdX * 2, canvas.height);
            // Horizontal lines
            ctx.moveTo(0, thirdY);
            ctx.lineTo(canvas.width, thirdY);
            ctx.moveTo(0, thirdY * 2);
            ctx.lineTo(canvas.width, thirdY * 2);
            ctx.stroke();
        } else if (overlayType === 'diagonal') {
            // Draw diagonal lines
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.moveTo(canvas.width, 0);
            ctx.lineTo(0, canvas.height);
            ctx.stroke();
        } else if (overlayType === 'fibonacci') {
            // Draw Fibonacci grid (simplified)
            let size = Math.min(canvas.width, canvas.height) * 0.9;
            let currentX = (canvas.width - size) / 2;
            let currentY = (canvas.height - size) / 2;
            let fib = [1, 1, 2, 3, 5, 8, 13];
            let currentSize = size / fib[fib.length - 1];

            ctx.beginPath();
            for (let i = 0; i < fib.length; i++) {
                let w = fib[i] * currentSize;
                let h = fib[i] * currentSize;
                ctx.rect(currentX, currentY, w, h);
                if (i % 2 === 0) currentX += w;
                else currentY += h;
            }
            ctx.stroke();
        }
    }
}

function resizeCanvas() {
    const canvas = document.getElementById('golden-ratio-canvas');
    const sizeType = document.getElementById('canvas-size').value;

    if (sizeType === 'square') {
        canvas.width = 400;
        canvas.height = 400;
    } else if (sizeType === 'landscape') {
        canvas.width = 600;
        canvas.height = 400;
    } else if (sizeType === 'portrait') {
        canvas.width = 400;
        canvas.height = 600;
    }

    drawOverlay();
}

function initCanvas() {
    resizeCanvas();
}