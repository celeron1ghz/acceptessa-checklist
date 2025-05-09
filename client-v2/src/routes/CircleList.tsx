import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';
import useSWR, { SWRResponse } from 'swr';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Header from '../component/Header';
import Loading from '../component/Loading';
import { columns } from '../component/table/column';

import '../component/table/style.css';

function getCircleData(exhibition_id: string): SWRResponse<CircleListResponse, any, { suspense: true }> {
  return useSWR('circle', () => {
    return fetch('https://data.familiar-life.info/' + exhibition_id + '.json')
      .then(data => data.ok ? data : Promise.reject(data))
      .then(data => data.json())
      .then(data => {
        let circleList = data.circles;

        // for circle of not upload circlecut, padding not uploaded image.
        for (const c of circleList) {
          if (!c.circlecut) {
            c.circlecut = `/${exhibition_id}/not_uploaded.png?_=${c.circle_id}`;
          }
        }

        // let sorter;
        // if (data.sort_order) {
        //   const sortMap = _.zipObject(data.sort_order, _.range(data.sort_order.length));
        //   sorter = (a, b) => {
        //     if (sortMap[a] && !sortMap[b]) {
        //       return 1;
        //     }
        //     if (!sortMap[a] && sortMap[b]) {
        //       return -1;
        //     }
        //     if (sortMap[a] > sortMap[b]) {
        //       return 1;
        //     }
        //     if (sortMap[a] < sortMap[b]) {
        //       return -1;
        //     }
        //     return 0;
        //   };

        //   circleList = circleList.sort((a, b) => {
        //     const sym = sorter(a.space_sym, b.space_sym);
        //     if (sym !== 0) return sym;

        //     if (a.space_num > b.space_num) {
        //       return 1;
        //     }
        //     if (a.space_num < b.space_num) {
        //       return -1;
        //     }
        //     return 0;
        //   });
        // }

        const ret: CircleListResponse = {
          type: 'success',
          circleList: circleList as Array<Circle>,
          exhibition: data.exhibition,
          map: data.map,
        };

        return ret;
      }).catch(err => {
        const ret: CircleListResponse = {
          type: 'error',
          error: err,
        };

        return ret;
      });
  }, { suspense: true });
}

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/list");

  if (!param) {
    return <></>;
  }

  const { data } = getCircleData(param.exhibition_id);

  if (data.type === 'error') {
    return (
      <Alert variant="danger" className='my-3'>
        <FontAwesomeIcon icon={faExclamationTriangle} /> 即売会が存在しません。(id={param.exhibition_id})
      </Alert>
    );
  }

  const [selectedCircle, setSelectedCircle] = useState<Circle>();

  const initialPageIndex = 0;
  const initialPageSize = -1;
  const circles = data.circleList;

  const table = useReactTable<Circle>({
    columns,
    data: circles,
    initialState: {
      pagination: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return <>
    <Header exhibition_id={param.exhibition_id} count={circles.length}></Header>
    <div className='text-secondary my-2'><FontAwesomeIcon icon={faInfoCircle} /> テーブルの行をクリックすると詳細画面が開きます。</div>
    {
      selectedCircle && selectedCircle.circle_id
    }
    <table id="circleList">
      <thead>
        {
          table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {
                headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {
                      header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
        {/* <tr>
          <td colSpan={2}>
            <input type="text" onChange={e => table.getColumn("space_sym")?.setFilterValue(e.target.value)} placeholder='記号' style={{ width: '3rem' }} />
          </td>
          <td>
            <input type="text" onChange={e => table.getColumn("circle_name")?.setFilterValue(e.target.value)} placeholder='サークル名' />
          </td>
          <td>
            <input type="text" onChange={e => table.getColumn("penname")?.setFilterValue(e.target.value)} placeholder='ペンネーム' />
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr> */}
      </thead>
      <tbody>
        {
          table.getRowModel().rows.map((row) =>
            <tr key={row.id} onClick={() => { setSelectedCircle(row.original as any) }}>
              {row.getVisibleCells().map((cell) => {
                return <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>;
              })}
            </tr>
          )
        }
      </tbody>
    </table>
  </>;
}

export default function Root(): ReactElement {
  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <Content />
      </Suspense>
    </Container>
  )
}
