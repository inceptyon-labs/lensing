/** Current state of the photo slideshow */
export interface PhotoSlideshow {
    photoPaths: string[];
    currentIndex: number;
    cycleInterval: number;
    transitionStyle: 'crossfade' | 'instant';
}
/** Ken Burns CSS animation parameters */
export interface KenBurnsConfig {
    /** Animation duration in milliseconds */
    duration: number;
    /** [start, end] scale factor — end > start for zoom-in */
    scale: [number, number];
    /** [min, max] horizontal pan percentage */
    panX: [number, number];
    /** [min, max] vertical pan percentage */
    panY: [number, number];
}
/** Default Ken Burns animation configuration */
export declare const DEFAULT_KEN_BURNS_CONFIG: KenBurnsConfig;
/** Default photo cycle interval in milliseconds */
export declare const DEFAULT_CYCLE_INTERVAL_MS = 8000;
/** Supported photo file extensions */
export declare const SUPPORTED_IMAGE_EXTENSIONS: string[];
//# sourceMappingURL=photo-slideshow.d.ts.map