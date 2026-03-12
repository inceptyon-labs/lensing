import path from 'path';
import { discoverPhotos } from './plugins/photo-slideshow/index';
export function createPhotoSlideshowServer(opts) {
    if (!opts.photoDir) {
        throw new Error('photoDir is required');
    }
    let photoPaths = [];
    return {
        async refresh() {
            const fsPaths = discoverPhotos(opts.photoDir);
            photoPaths = fsPaths.map((p) => `/photos/${path.basename(p)}`);
            opts.dataBus.publish('photos.paths', 'photo-slideshow-server', {
                photoPaths,
                lastUpdated: Date.now(),
            });
        },
        close() { },
        getPhotoPaths() {
            return photoPaths;
        },
    };
}
//# sourceMappingURL=photo-slideshow-server.js.map