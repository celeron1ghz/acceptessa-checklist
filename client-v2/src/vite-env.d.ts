/// <reference types="vite/client" />
interface Circle {
    circle_id: string;
    circle_name: string;
    circle_kana: string;
    circle_link: string;
    circle_comment: string;
    circlecut: string;
    penname: string;
    penname_kane: string;
    space_count: string;
    space_num: string;
    space_sym: string;
    twitter_id: string;
    pixiv_url: string;
    site_url: string;
}

interface Exhibition {
    id: string;
    exhibition_name: string;
}

type CircleListResponse = SuccessResponse | ErrorResponse;

type SuccessResponse = {
    type: 'success';
    circleList: Array<Circle>;
    exhibition: Exhibition;
}

type ErrorResponse = {
    type: 'error';
    error: Error;
}

type ExhibitionResponse = OutputConfig | ErrorResponse;

interface OutputConfig {
    type: 'success';
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