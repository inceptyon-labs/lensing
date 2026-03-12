export interface FixtureLoaderOptions {
    fixturesDir: string;
    readDir: () => Promise<string[]>;
    readFile: (path: string) => Promise<string>;
}
export interface FixtureLoader {
    list(): Promise<string[]>;
    load(name: string): Promise<unknown>;
    loadAll(): Promise<Record<string, unknown>>;
}
export declare function createFixtureLoader(options: FixtureLoaderOptions): FixtureLoader;
//# sourceMappingURL=fixture-loader.d.ts.map