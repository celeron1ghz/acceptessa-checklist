import { faLink, faQuestion, IconPack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AccessorKeyColumnDef, createColumnHelper } from '@tanstack/react-table';
// import moment from 'moment';
// import relativeDate from 'relative-date';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab as IconPack);

const columnHelpr = createColumnHelper<Circle>();

export const columns: AccessorKeyColumnDef<Circle, string>[] = [
    columnHelpr.accessor('space_sym', {
        header: '記号',
        size: 50,

        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return <FontAwesomeIcon icon={faQuestion} />;
            }

            return <span>{v}</span>
        }
    }),

    columnHelpr.accessor('space_num', {
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
    }),

    columnHelpr.accessor('circle_name', {
        header: 'サークル名',
        size: 90,
    }),

    columnHelpr.accessor('penname', {
        header: 'ペンネーム',
        size: 90,
    }),

    columnHelpr.accessor('circle_comment', {
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
    }),

    columnHelpr.accessor('twitter_id', {
        // header: <FontAwesomeIcon icon={['fab', 'twitter']} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={`https://x.com/${v}`} target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
        }
    }),

    columnHelpr.accessor('pixiv_url', {
        // header: <FontAwesomeIcon icon={['fab', 'pixiv']} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={v} target="_blank"><FontAwesomeIcon icon={['fab', 'pixiv']} /></a>
        }
    }),

    columnHelpr.accessor('site_url', {
        // header: <FontAwesomeIcon icon={faLink} />,
        size: 40,
        cell: (props) => {
            const v = props.getValue() as string;

            if (!v) {
                return null;
            }

            return <a href={v} target="_blank"><FontAwesomeIcon icon={faLink} /></a>
        }
    }),

];
