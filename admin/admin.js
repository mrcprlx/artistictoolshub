(async () => {
    const auth0 = window.auth0;
    if (!auth0) {
        console.error('Auth0 SDK not loaded');
        document.getElementById('auth-status').textContent = 'Authentication error: SDK not loaded.';
        return;
    }

    let auth0Client = null;

    async function initAuth0() {
        auth0Client = await auth0.createAuth0Client({
            domain: 'login.artistictoolshub.com',
            clientId: 'mbJ5rUjoVg7ztjnzO7MsHKlv66KYlkF1', // Replace with your Auth0 Client ID
            authorizationParams: {
                redirect_uri: 'https://artistictoolshub.com/admin'
            }
        });

        // Handle redirect callback with code and state
        const query = new URLSearchParams(window.location.search);
        if (query.get('code') && query.get('state')) {
            try {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, '/admin');
            } catch (error) {
                console.error('Error handling redirect callback:', error);
                document.getElementById('auth-status').textContent = 'Authentication error. Please try again.';
                return;
            }
        }

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
        try {
            const response = await fetch('/.netlify/functions/manage-submissions', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const submissions = await response.json();
            const submissionsList = document.getElementById('submissions-list');
            submissionsList.innerHTML = submissions.map(sub => `
        <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
          <img src="${sub.url}" alt="Submission" style="max-width: 200px; display: ${sub.url ? 'block' : 'none'};">
          <p>ID: ${sub.id}</p>
          <p>Status: ${sub.status}</p>
          <p>Created: ${new Date(sub.created_at).toLocaleDateString()}</p>
          <button onclick="approveSubmission('${sub.id}')">Approve</button>
          <button onclick="declineSubmission('${sub.id}')">Decline</button>
          <button onclick="removeSubmission('${sub.id}')">Remove</button>
        </div>
      `).join('');
        } catch (error) {
            console.error('Error loading submissions:', error);
            document.getElementById('submissions-list').innerHTML = '<p>Error loading submissions. Please try again.</p>';
        }
    }

    async function approveSubmission(id) {
        try {
            const response = await fetch('/.netlify/functions/manage-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'approve' })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await loadSubmissions(); // Refresh list
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('Failed to approve submission.');
        }
    }

    async function declineSubmission(id) {
        try {
            const response = await fetch('/.netlify/functions/manage-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'decline' })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await loadSubmissions(); // Refresh list
        } catch (error) {
            console.error('Error declining submission:', error);
            alert('Failed to decline submission.');
        }
    }

    async function removeSubmission(id) {
        try {
            const response = await fetch('/.netlify/functions/manage-submissions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await loadSubmissions(); // Refresh list
        } catch (error) {
            console.error('Error removing submission:', error);
            alert('Failed to remove submission.');
        }
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