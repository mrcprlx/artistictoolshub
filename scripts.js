document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '🌙';
    }

    // Toggle theme
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        toggleButton.textContent = body.classList.contains('dark-mode') ? '🌙' : '☀️';
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
});