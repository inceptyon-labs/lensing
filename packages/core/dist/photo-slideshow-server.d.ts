import type { DataBusInstance } from '@lensing/types';
export interface PhotoSlideshowServerOptions {
    photoDir: string;
    dataBus: DataBusInstance;
}
export interface PhotoSlideshowServerInstance {
    refresh(): Promise<void>;
    close(): void;
    getPhotoPaths(): string[];
}
export declare function createPhotoSlideshowServer(opts: PhotoSlideshowServerOptions): PhotoSlideshowServerInstance;
//# sourceMappingURL=photo-slideshow-server.d.ts.map