export interface PublishValidationError {
    field: string;
    code: string;
    message: string;
}
export interface ValidatePublishResult {
    valid: boolean;
    errors: PublishValidationError[];
}
export interface ValidatePublishInput {
    id: string;
    name: string;
    version: string;
    description?: string;
    category?: string;
    connector: {
        type: string;
        url: string;
        method?: string;
        headers?: Record<string, string>;
        refreshInterval?: number;
    };
    html: string;
    css?: string;
    connectorTested: boolean;
    sampleData: Record<string, unknown> | null;
}
export declare function validatePublish(input: ValidatePublishInput, existingPluginIds: string[]): ValidatePublishResult;
//# sourceMappingURL=publish-validation.d.ts.map