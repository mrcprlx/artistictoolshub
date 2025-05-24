let auth0Client = null;

async function initAuth0() {
    auth0Client = await auth0.createAuth0Client({
        domain: 'login.artistictoolshub.com',
        clientId: 'mbJ5rUjoVg7ztjnzO7MsHKlv66KYlkF1', // Replace with your Auth0 Client ID
        authorizationParams: {
            redirect_uri: 'https://artistictoolshub.com/admin'
        }
    });

    // Check if user is authenticated
    const isAuthenticated = await auth0Client.isAuthenticated();
    const authStatus = document.getElementById('auth-status');
    const adminContent = document.getElementById('admin-content');

    if (isAuthenticated) {
        authStatus.style.display = 'none';
        adminContent.style.display = 'block';
        loadSubmissions();
    } else {
        authStatus.textContent = 'Redirecting to login...';
        // Redirect to Auth0 login
        await auth0Client.loginWithRedirect();
    }
}

async function loadSubmissions() {
    const submissionsList = document.getElementById('submissions-list');
    // Placeholder: Fetch submissions from your backend or Netlify Functions
    submissionsList.innerHTML = `
    <p>Submission 1: <button onclick="approveSubmission(1)">Approve</button>
    <button onclick="declineSubmission(1)">Decline</button>
    <button onclick="removeSubmission(1)">Remove</button></p>
    <p>Submission 2: <button onclick="approveSubmission(2)">Approve</button>
    <button onclick="declineSubmission(2)">Decline</button>
    <button onclick="removeSubmission(2)">Remove</button></p>
  `;
}

async function approveSubmission(id) {
    // Implement API call to approve submission (e.g., via Netlify Functions)
    console.log(`Approved submission ${id}`);
}

async function declineSubmission(id) {
    // Implement API call to decline submission
    console.log(`Declined submission ${id}`);
}

async function removeSubmission(id) {
    // Implement API call to remove submission
    console.log(`Removed submission ${id}`);
}

async function logout() {
    await auth0Client.logout({
        logoutParams: {
            returnTo: 'https://artistictoolshub.com'
        }
    });
}

// Initialize on page load
window.onload = initAuth0;