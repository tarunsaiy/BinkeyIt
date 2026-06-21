import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Loading from './Loading'
import {
  dashboardTableCellClass,
  dashboardTableCellMutedClass,
  dashboardTableHeaderClass,
} from '../utils/dashboardStyles'

const Table = ({ data, column, loading = false }) => {
  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading color="green" size="w-8 h-8" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-[#eeeeee] bg-white px-4 py-10 text-center text-xs text-[#666666]">
        No records found
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#eeeeee] bg-white">
      <table className="w-full">
        <thead className="border-b border-[#eeeeee] bg-[#fafafa]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th className={dashboardTableHeaderClass}>S.No</th>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={dashboardTableHeaderClass}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className="border-b border-[#eeeeee] last:border-b-0">
              <td className={dashboardTableCellMutedClass}>{index + 1}</td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={dashboardTableCellClass}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
