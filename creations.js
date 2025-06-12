// State
let creations = [];
let currentPage = 1;
let itemsPerPage = 10;
const creationsGrid = document.getElementById('creations-grid');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const itemsPerPageSelect = document.getElementById('items-per-page');

// HTML escape function for non-URL text
function escapeHtml(text) {
    const map = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

// Show/hide submission form
document.getElementById('submit-creation').addEventListener('click', (e) => {
    e.preventDefault();
    const formSection = document.getElementById('submission-form');
    formSection.style.display = formSection.style.display === 'block' ? 'none' : 'block';
    if (formSection.style.display === 'block') {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const formTop = formSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: formTop - headerHeight,
            behavior: 'smooth'
        });
    }
});

// Form submission with reCAPTCHA
window.onSubmit = function (token) {
    submitForm(token);
};

async function submitForm(recaptchaResponse) {
    const title = document.getElementById('creation-title').value;
    const text = document.getElementById('creation-text').value;
    const image = document.getElementById('creation-image').files[0];
    const author = document.getElementById('creation-author').value;

    // Validate title (100 characters)
    if (title.length > 100) {
        alert('Title exceeds 100 characters.');
        grecaptcha.reset();
        return;
    }

    // Validate text (5000 characters)
    if (text.length > 5000) {
        alert('Text exceeds 5000 characters.');
        grecaptcha.reset();
        return;
    }

    // Validate image (2MB, PNG/JPG)
    let imageBase64 = null;
    if (image) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (image.size > maxSize) {
            alert('Image exceeds 2MB.');
            grecaptcha.reset();
            return;
        }
        if (!['image/png', 'image/jpeg'].includes(image.type)) {
            alert('Only PNG or JPG images allowed.');
            grecaptcha.reset();
            return;
        }
        imageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.readAsDataURL(image);
        });
    }

    // Submit to Netlify Function
    try {
        const response = await fetch('/.netlify/functions/submit-creation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                text,
                image: imageBase64,
                author,
                'g-recaptcha-response': recaptchaResponse,
            }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Submission failed');
        document.getElementById('form-message').style.display = 'block';
        document.getElementById('creation-form').reset();
        setTimeout(() => {
            document.getElementById('submission-form').style.display = 'none';
            document.getElementById('form-message').style.display = 'none';
        }, 2000);
        fetchCreations();
    } catch (error) {
        alert('Submission failed: ' + error.message);
        grecaptcha.reset();
    }
}

// Prevent default form submission
document.getElementById('creation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    grecaptcha.execute();
});

// Fetch creations
async function fetchCreations() {
    try {
        const response = await fetch('/.netlify/functions/get-creations');
        if (!response.ok) throw new Error('Failed to fetch creations');
        creations = await response.json();
        console.log('Fetched creations:', creations);
        // Sort creations by createdAt in descending order (newest first)
        creations.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });
        renderCreations();
    } catch (error) {
        console.error('Error fetching creations:', error);
        creations = [];
        renderCreations();
    }
}

// Render creations
function renderCreations() {
    if (!creationsGrid) {
        console.error('creationsGrid element not found');
        return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const creationsToShow = creations.slice(start, end);
    console.log('Rendering creations:', creationsToShow);

    creationsGrid.innerHTML = '';
    creationsToShow.forEach((creation) => {
        const card = document.createElement('div');
        card.className = 'creation-card';

        // Parse creator field for multiple URLs
        let creatorContent = creation.creator || '';
        console.log('Raw creator content:', JSON.stringify(creatorContent));
        if (creatorContent) {
            const urlRegex = /^https?:\/\/[^\s]*$/i;
            creatorContent = creatorContent
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    if (urlRegex.test(line)) {
                        return `<a href="${line}" class="author-link" target="_blank" rel="noopener noreferrer">${line}</a>`;
                    }
                    return escapeHtml(line);
                })
                .join('<br>');
            console.log('Processed creator content:', creatorContent);
        }

        card.innerHTML = `
            <h3>${creation.title || 'Untitled'}</h3>
            <p class="creation-text">${creation.text}</p>
            ${creation.image ? `<img src="${creation.image}" alt="Creation image">` : ''}
            ${creatorContent ? `
                <div class="creator-info">
                    <div class="creator-label">Social Links:</div>
                    <div class="creator-links">${creatorContent}</div>
                </div>
            ` : ''}
        `;
        creationsGrid.appendChild(card);
    });

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = end >= creations.length;
}

// Pagination controls
itemsPerPageSelect.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderCreations();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCreations();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage * itemsPerPage < creations.length) {
        currentPage++;
        renderCreations();
    }
});

// Initial fetch
fetchCreations();