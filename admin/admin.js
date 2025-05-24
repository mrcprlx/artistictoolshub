(async () => {
    let auth0Client = null;

    async function initAuth0() {
        if (!window.auth0) {
            throw new Error('Auth0 SDK not loaded');
        }
        auth0Client = await window.auth0.createAuth0Client({
            domain: 'login.artistictoolshub.com',
            clientId: 'YOUR_AUTH0_CLIENT_ID', // Replace with your Auth0 Client ID
            authorizationParams: {
                redirect_uri: 'https://artistictoolshub.com/admin'
            }
        });

        const isAuthenticated = await auth0Client.isAuthenticated();
        const authStatus = document.getElementById('auth-status');
        const adminContent = document.getElementById('admin-content');

        if (isAuthenticated) {
            authStatus.style.display = 'none';
            adminContent.style.display = 'block';
            loadSubmissions();
        } else {
            authStatus.textContent = 'Redirecting to login...';
            await auth0Client.loginWithRedirect();
        }
    }

    async function loadSubmissions() {
        const submissionsList = document.getElementById('submissions-list');
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
        console.log(`Approved submission ${id}`);
    }

    async function declineSubmission(id) {
        console.log(`Declined submission ${id}`);
    }

    async function removeSubmission(id) {
        console.log(`Removed submission ${id}`);
    }

    async function logout() {
        await auth0Client.logout({
            logoutParams: {
                returnTo: 'https://artistictoolshub.com'
            }
        });
    }

    try {
        await initAuth0();
    } catch (error) {
        console.error('Auth0 initialization failed:', error);
        document.getElementById('auth-status').textContent = 'Authentication error. Please try again.';
    }
})();