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
export declare function createPublisherPr(config: PublisherConfig): Promise<PublisherResult>;
//# sourceMappingURL=publisher.d.ts.map