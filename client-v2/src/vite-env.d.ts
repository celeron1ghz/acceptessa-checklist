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

type CircleListResponse = SuccessResponse | ErrorResponse;

type SuccessResponse = {
    type: 'success';
    circleList: Array<Circle>;
    exhibition: Object;
    map: Object;
}

type ErrorResponse = {
    type: 'error';
    error: Error;
}