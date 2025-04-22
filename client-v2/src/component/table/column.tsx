import { faLink, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
// import moment from 'moment';
// import relativeDate from 'relative-date';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab);

export type Circle = {
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
};

export const columns: ColumnDef<Circle>[] = [
    {
        accessorKey: 'space_sym',
        header: '記号',
        size: 50,

        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return <FontAwesomeIcon icon={faQuestion} />;
            }

            return <span>{v}</span>
        }
    },
    {
        accessorKey: 'space_num',
        header: '数値',
        maxSize: 60,
        minSize: 60,
        size: 60,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return <FontAwesomeIcon icon={faQuestion} />;
            }

            return <span>{v}</span>
        }
    },
    {
        accessorKey: 'circle_name',
        header: 'サークル名',
        size: 90,
    },
    {
        accessorKey: 'penname',
        header: 'ペンネーム',
        size: 90,
    },
    {
        accessorKey: 'circle_comment',
        header: 'お品書き',
        size: 90,
        cell: (props) => {
            const v = props.getValue() as string;

            // if (!v || v.length < 20) {
            //     return v;
            // }

            // return v.substring(0, 20) + "...";
            return v;
        }
    },
    {
        accessorKey: 'twitter_id',
        header: <FontAwesomeIcon icon={['fab', 'twitter']} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={`https://x.com/${v}`} target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
        }
    },
    {
        accessorKey: 'pixiv_url',
        header: <FontAwesomeIcon icon={['fab', 'pixiv']} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={v} target="_blank"><FontAwesomeIcon icon={['fab', 'pixiv']} /></a>
        }
    },
    {
        accessorKey: 'site_url',
        header: <FontAwesomeIcon icon={faLink} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={v} target="_blank"><FontAwesomeIcon icon={faLink} /></a>
        }
    },
];
