/**
 * GitHub API publisher for marketplace plugins.
 * Handles PR creation to publish plugins to the marketplace repository.
 */

export interface PublisherConfig {
  githubToken: string;
  marketplaceRepoUrl: string;
  pluginId: string;
  pluginName: string;
  pluginDescription: string;
  version: string;
  zipContent: Buffer;
  thumbnailContent: Buffer;
  indexUpdate: Record<string, Record<string, unknown>>;
}

export interface PublisherResult {
  url: string;
}

/**
 * Create a PR on the marketplace repository with plugin ZIP, thumbnail, and index.json update.
 */
export async function createPublisherPr(config: PublisherConfig): Promise<PublisherResult> {
  const {
    githubToken,
    marketplaceRepoUrl,
    pluginId,
    pluginName,
    pluginDescription,
    version,
    zipContent,
    thumbnailContent,
    indexUpdate,
  } = config;

  if (!githubToken) {
    throw new Error('GitHub token is required');
  }

  const match = marketplaceRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid marketplaceRepoUrl');
  const [, owner, repo] = match;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  async function ghRequest<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${apiBase}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const err = (await response.json()) as { message?: string };
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

    return response.json() as T;
  }

  // Get repo default branch
  const repoData = await ghRequest<{ default_branch?: string }>('GET', '');
  const defaultBranch = repoData.default_branch ?? 'main';

  // Get base SHA for branch creation
  const refData = await ghRequest<{ object?: { sha: string } }>(
    'GET',
    `/git/ref/heads/${defaultBranch}`
  );
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
  const pr = await ghRequest<{ html_url?: string }>('POST', '/pulls', {
    title: `Add plugin: ${pluginName} v${version}`,
    body: `## ${pluginName} v${version}\n\n${pluginDescription}`,
    head: branchName,
    base: defaultBranch,
  });

  return { url: pr.html_url ?? '' };
}
