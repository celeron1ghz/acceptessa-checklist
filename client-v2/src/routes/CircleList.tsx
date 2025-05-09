import { ReactElement, Suspense, useState } from 'react';
import { useRoute } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Alert, Container } from 'react-bootstrap';
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
import { getCircleData, getExhibitionData } from '../component/Client';

import '../component/table/style.css';

function Content(): ReactElement {
  const [, param] = useRoute("/:exhibition_id/list");

  if (!param) {
    return <>SETTING_FAILED</>;
  }

  const { data } = getCircleData(param.exhibition_id);

  if (data.type === 'error') {
    return (
      <Alert variant="danger" className='my-3'>
        <FontAwesomeIcon icon={faExclamationTriangle} /> 即売会が存在しません。(id={param.exhibition_id})
      </Alert>
    );
  }

  const { data: data2 } = getExhibitionData(param.exhibition_id);

  if (data2.type === 'error') {
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
    <Header exhibition={data.exhibition} count={circles.length}></Header>
    <div className='my-3'>
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
    </div>
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
