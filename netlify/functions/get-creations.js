const axios = require('axios');

exports.handler = async () => {
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'your-repo-owner'; // Replace with your GitHub username/organization
    const repoName = 'your-repo-name';   // Replace with your repository name
    const branch = 'main';
    const path = 'content/creations';

    const response = await axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`,
        { headers: { Authorization: `Bearer ${githubToken}` } }
    );

    const creations = await Promise.all(
        response.data
            .filter(file => file.name.endsWith('.md'))
            .map(async file => {
                const fileContent = await axios.get(file.download_url);
                const content = fileContent.data;
                const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
                if (!frontmatterMatch) return null;
                const frontmatter = frontmatterMatch[1].split('\n').reduce((acc, line) => {
                    const [key, value] = line.split(': ').map(s => s.trim());
                    if (key) acc[key] = value.replace(/^"(.*)"$/, '$1');
                    return acc;
                }, {});
                return frontmatter.published === 'true' ? { id: file.name, ...frontmatter } : null;
            })
    );

    return { statusCode: 200, body: JSON.stringify(creations.filter(c => c !== null)) };
};