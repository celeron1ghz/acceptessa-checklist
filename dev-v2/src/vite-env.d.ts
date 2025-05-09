/// <reference types="vite/client" />
interface InputConfig {
    tweet: OutputTweet;
    marker_size: MarkerSize;
    vertial_space?: VertialCoords[] | null;
    horizontal_space?: HorizontalCoords[] | null;
    custom_space?: OutputCoords[] | null;
}

interface OutputConfig {
    tweet: OutputTweet;
    map: OutputMap;
}

interface OutputTweet {
    url: string;
    related: string;
    hashtags: string;
}

interface OutputMap {
    image_width: number;
    image_height: number;
    mappings: OutputCoords[];
}

interface OutputCoords {
    w: number;
    h: number;
    l: number;
    t: number;
    s: string;
    n: string;
}

interface MarkerSize {
    width: number;
    height: number;
}

interface VertialCoords {
    left: number;
    tops: string[];
    sym: string;
    num?: number;
    reverse: boolean;
}

interface HorizontalCoords {
    top: number;
    lefts: string[];
    sym: string;
    num?: number;
    reverse: boolean;
}

interface InputImageData {
    width: number;
    height: number;
    src: string;
}