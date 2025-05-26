// State
let creations = [];
let currentPage = 1;
let itemsPerPage = 10;
const creationsGrid = document.getElementById('creations-grid');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const itemsPerPageSelect = document.getElementById('items-per-page');

// Show/hide submission form
document.getElementById('submit-creation').addEventListener('click', (e) => {
    e.preventDefault();
    const formSection = document.getElementById('submission-form');
    formSection.style.display = formSection.style.display === 'block' ? 'none' : 'block';
    formSection.scrollIntoView({ behavior: 'smooth' });
});

// Form submission with reCAPTCHA v2 Invisible
window.onSubmit = function (token) {
    console.log('reCAPTCHA token received:', token);
    submitForm(token);
};

async function submitForm(recaptchaResponse) {
    const text = document.getElementById('creation-text').value;
    const image = document.getElementById('creation-image').files[0];
    const author = document.getElementById('creation-author').value;

    // Validate text (500 words)
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 500) {
        alert('Text exceeds 500 words.');
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
        // Convert image to base64
        imageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(image);
        });
    }

    // Submit to Netlify Function
    try {
        const requestBody = {
            text,
            image: imageBase64,
            author,
            'g-recaptcha-response': recaptchaResponse
        };
        console.log('Sending request to Netlify Function:', {
            url: '/.netlify/functions/submit-creation',
            method: 'POST',
            body: { ...requestBody, image: imageBase64 ? '[base64]' : null }
        });
        const response = await fetch('/.netlify/functions/submit-creation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        const responseClone = response.clone();
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            const rawText = await responseClone.text();
            console.error('Raw response:', rawText.slice(0, 200));
            throw new Error(`Server error: ${response.status} ${response.statusText} - Non-JSON response`);
        }
        if (!response.ok) {
            console.error('Netlify Function error:', responseBody);
            throw new Error(responseBody.message || `Submission failed: ${response.status}`);
        }
        document.getElementById('form-message').style.display = 'block';
        document.getElementById('creation-form').reset();
        setTimeout(() => {
            document.getElementById('submission-form').style.display = 'none';
            document.getElementById('form-message').style.display = 'none';
        }, 2000);
        // Refresh creations
        fetchCreations();
    } catch (error) {
        console.error('Submission error:', error);
        alert('Submission failed: ' + error.message);
        grecaptcha.reset();
        return;
    }
}

// Prevent default form submission
document.getElementById('creation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted, executing reCAPTCHA');
    grecaptcha.execute();
});

// Fetch creations from Netlify CMS
async function fetchCreations() {
    try {
        const response = await fetch('/.netlify/functions/get-creations');
        if (!response.ok) throw new Error('Failed to fetch creations');
        creations = await response.json();
        renderCreations();
    } catch (error) {
        console.error('Error fetching creations:', error);
        creations = [];
        renderCreations();
    }
}

// Render creations
function renderCreations() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const creationsToShow = creations
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
        .slice(start, end);

    creationsGrid.innerHTML = '';
    creationsToShow.forEach((creation) => {
        const card = document.createElement('div');
        card.className = 'creation-card';
        card.innerHTML = `
        <h3>${creation.text.split(/\s+/).slice(0, 5).join(' ') || 'Untitled'}</h3>
        <p>${creation.text}</p>
        ${creation.image ? `<img src="${creation.image}" alt="Creation image">` : ''}
        ${creation.author ? `<a href="${creation.author.startsWith('http') ? creation.author : '#'}" class="author-link">${creation.author}</a>` : ''}
        <div class="share-container">
          <button class="share-button">Share</button>
          <div class="share-submenu">
            <a href="https://x.com/intent/tweet?text=Check%20out%20this%20creation%20on%20ArtisticToolsHub!&url=${encodeURIComponent(`https://artistictoolshub.com/creations?id=${creation.id}`)}" target="_blank">Share on X</a>
            <a href="mailto:?subject=Check%20out%20this%20creation!&body=See%20this%20on%20ArtisticToolsHub:%20https://artistictoolshub.com/creations?id=${creation.id}" target="_blank">Email</a>
            <button onclick="copyLink('${creation.id}')">Copy Link</button>
          </div>
        </div>
      `;
        creationsGrid.appendChild(card);
    });

    // Update pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = end >= creations.length;
}

// Copy link to clipboard
window.copyLink = function (id) {
    const url = `https://artistictoolshub.com/creations?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy link.');
    });
};

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