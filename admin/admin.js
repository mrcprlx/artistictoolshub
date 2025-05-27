(async () => {
    // Check if Auth0 SDK is loaded
    if (!window.auth0) {
        console.error('Auth0 SDK not loaded');
        document.getElementById('auth-status').textContent = 'Authentication error: SDK not loaded.';
        return;
    }

    let auth0Client = null;

    async function initAuth0() {
        try {
            auth0Client = await window.auth0.createAuth0Client({
                domain: window.ENV.AUTH0_DOMAIN,
                clientId: window.ENV.AUTH0_CLIENT_ID,
                authorizationParams: {
                    redirect_uri: 'https://artistictoolshub.com/admin',
                    audience: window.ENV.AUTH0_AUDIENCE
                },
                cacheLocation: 'localstorage'
            });

            // Handle redirect callback
            const query = new URLSearchParams(window.location.search);
            if (query.get('code') && query.get('state')) {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, '/admin');
            }

            // Check authentication status
            const isAuthenticated = await auth0Client.isAuthenticated();
            const authStatus = document.getElementById('auth-status');
            const adminContent = document.getElementById('admin-content');

            if (isAuthenticated) {
                authStatus.style.display = 'none';
                adminContent.style.display = 'block';
                // Redirect to Netlify CMS
                window.location.href = '/admin/cms';
            } else {
                authStatus.style.display = 'block';
                authStatus.textContent = 'Please log in to manage submissions.';
                const loginButton = document.createElement('button');
                loginButton.textContent = 'Log in';
                loginButton.className = 'cta-button';
                loginButton.onclick = async () => {
                    await auth0Client.loginWithRedirect({
                        authorizationParams: {
                            connection: 'auth0', // Use Auth0 connection for Netlify Identity
                            redirect_uri: 'https://artistictoolshub.com/.netlify/identity/callback'
                        }
                    });
                };
                adminContent.innerHTML = '';
                adminContent.appendChild(loginButton);
            }
        } catch (error) {
            console.error('Auth0 initialization failed:', error);
            document.getElementById('auth-status').textContent = 'Authentication error. Please try again.';
        }
    }

    async function logout() {
        try {
            await auth0Client.logout({
                logoutParams: {
                    returnTo: 'https://artistictoolshub.com'
                }
            });
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Failed to logout. Please try again.');
        }
    }

    // Add logout button
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Log out';
    logoutButton.className = 'cta-button';
    logoutButton.onclick = logout;
    document.getElementById('admin-content').appendChild(logoutButton);

    // Initialize Auth0
    await initAuth0();
})();