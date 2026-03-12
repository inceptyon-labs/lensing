/**
 * GitHub API publisher for marketplace plugins.
 * Handles PR creation to publish plugins to the marketplace repository.
 */
/**
 * Create a PR on the marketplace repository with plugin ZIP, thumbnail, and index.json update.
 */
export async function createPublisherPr(config) {
    const { githubToken, marketplaceRepoUrl, pluginId, pluginName, pluginDescription, version, zipContent, thumbnailContent, indexUpdate, } = config;
    if (!githubToken) {
        throw new Error('GitHub token is required');
    }
    const match = marketplaceRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match)
        throw new Error('Invalid marketplaceRepoUrl');
    const [, owner, repo] = match;
    const GITHUB_SEGMENT_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
    if (!GITHUB_SEGMENT_RE.test(owner))
        throw new Error(`Invalid owner in marketplaceRepoUrl: "${owner}"`);
    if (!GITHUB_SEGMENT_RE.test(repo))
        throw new Error(`Invalid repo in marketplaceRepoUrl: "${repo}"`);
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    };
    async function ghRequest(method, path, body) {
        const response = await fetch(`${apiBase}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const err = (await response.json());
            if (response.status === 401) {
                throw new Error(`GitHub auth error: ${err.message ?? 'Bad credentials'}`);
            }
            if (response.status === 403) {
                throw new Error('GitHub rate limit exceeded');
            }
            if (response.status === 422) {
                throw new Error('Conflict: Plugin already exists in index.json');
            }
            throw new Error(`GitHub API error ${response.status}: ${err.message}`);
        }
        return response.json();
    }
    // Get repo default branch
    const repoData = await ghRequest('GET', '');
    const defaultBranch = repoData.default_branch ?? 'main';
    // Get base SHA for branch creation
    const refData = await ghRequest('GET', `/git/ref/heads/${defaultBranch}`);
    const baseSha = refData.object?.sha ?? '';
    // Create branch: plugin/<pluginId>-<version>
    const branchName = `plugin/${pluginId}-${version}`;
    await ghRequest('POST', '/git/refs', {
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
    });
    // Commit ZIP file
    await ghRequest('PUT', `/contents/plugins/${pluginId}/${pluginId}-${version}.zip`, {
        message: `Add ${pluginId}-${version}.zip`,
        content: zipContent.toString('base64'),
        branch: branchName,
    });
    // Commit thumbnail
    await ghRequest('PUT', `/contents/plugins/${pluginId}/thumbnail.png`, {
        message: `Add ${pluginId} thumbnail`,
        content: thumbnailContent.toString('base64'),
        branch: branchName,
    });
    // Update index.json
    const indexJson = JSON.stringify(indexUpdate, null, 2);
    await ghRequest('PUT', '/contents/index.json', {
        message: `Update index.json for ${pluginId} v${version}`,
        content: Buffer.from(indexJson).toString('base64'),
        branch: branchName,
    });
    // Create PR
    const pr = await ghRequest('POST', '/pulls', {
        title: `Add plugin: ${pluginName} v${version}`,
        body: `## ${pluginName} v${version}\n\n${pluginDescription}`,
        head: branchName,
        base: defaultBranch,
    });
    return { url: pr.html_url ?? '' };
}
//# sourceMappingURL=publisher.js.map