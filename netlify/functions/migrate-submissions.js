const axios = require('axios');
const matter = require('gray-matter');

exports.handler = async (event) => {
    // Restrict access to authenticated admins
    if (!event.headers['x-netlify-identity-user']) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized: Admin access required' }),
        };
    }

    try {
        console.log('Starting migration of submissions from submissions branch');
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = 'mrcprlx/artistictoolshub'; // Replace with actual repo owner and name

        // Get list of files in content/creations from submissions branch
        let files = [];
        try {
            const response = await axios.get(
                `https://api.github.com/repos/${repo}/contents/content/creations?ref=submissions`,
                {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            files = response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('No submissions found in submissions branch');
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'No submissions to migrate' }),
                };
            }
            throw error;
        }

        let migratedCount = 0;
        for (const file of files) {
            if (file.type === 'file' && file.name.endsWith('.md')) {
                // Fetch file content
                const fileResponse = await axios.get(file.download_url);
                const { data } = matter(fileResponse.data);

                // Migrate published submissions to main branch
                if (data.published) {
                    const content = Buffer.from(fileResponse.data).toString('base64');
                    try {
                        const controllerGitHub = new AbortController();
                        const timeoutGitHub = setTimeout(() => controllerGitHub.abort(), 5000);
                        await axios.put(
                            `https://api.github.com/repos/${repo}/contents/${file.path}`,
                            {
                                message: `Migrate approved submission: ${data.title}`,
                                content: content,
                                branch: 'main'
                            },
                            {
                                headers: {
                                    Authorization: `token ${githubToken}`,
                                    Accept: 'application/vnd.github.v3+json',
                                },
                                signal: controllerGitHub.signal,
                            }
                        );
                        clearTimeout(timeoutGitHub);
                        console.log('Migrated submission to main branch', { path: file.path });
                        migratedCount++;

                        // Delete file from submissions branch
                        await axios.delete(
                            `https://api.github.com/repos/${repo}/contents/${file.path}`,
                            {
                                headers: {
                                    Authorization: `token ${githubToken}`,
                                    Accept: 'application/vnd.github.v3+json',
                                },
                                data: {
                                    message: `Remove migrated submission: ${data.title}`,
                                    sha: file.sha,
                                    branch: 'submissions'
                                },
                            }
                        );
                        console.log('Deleted submission from submissions branch', { path: file.path });
                    } catch (githubError) {
                        console.error('GitHub API error for submission', {
                            title: data.title,
                            message: githubError.message,
                            response: githubError.response?.data
                        });
                    }
                }
            }
        }

        // Trigger Netlify build if migrations occurred
        if (migratedCount > 0) {
            const buildHook = process.env.NETLIFY_BUILD_HOOK;
            if (buildHook) {
                await axios.post(buildHook);
                console.log('Triggered Netlify build');
            }
        }

        console.log('Migration completed', { migratedCount });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Migration completed, ${migratedCount} submissions migrated` }),
        };
    } catch (error) {
        console.error('Migration error', { message: error.message, stack: error.stack });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Migration error', details: error.message, stack: error.stack }),
        };
    }
};