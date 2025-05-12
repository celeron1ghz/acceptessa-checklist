import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { columns } from './column';
import './style.css';

export function CircleListTable(param: { circles: Circle[], onSelectedCircle: Function }) {
  const initialPageIndex = 0;
  const initialPageSize = -1;
  const table = useReactTable<Circle>({
    columns,
    data: param.circles,
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

  return (
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
        <tr>
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
        </tr>
      </thead>
      <tbody>
        {
          table.getRowModel().rows.map((row) =>
            <tr key={row.id} onClick={() => { param.onSelectedCircle(row.original as any) }}>
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
  );
}