import {Pagination} from "@heroui/pagination";
import React from 'react'

interface TablePaginationProps {
  page: number
  total: number
  setPage: (page: number) => void
  itemsLength: number
  label?: string|React.ReactNode
  rowsPerPage: number
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  rowsPerPageLabel?: string | React.ReactNode
  className?: string
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  total,
  setPage,
  itemsLength,
  label = '',
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageLabel = 'Ligne par page:',
  className = '',
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center ">
      <span className="w-[30%] text-small text-default-400">
        {label} {itemsLength}
      </span>
      <Pagination page={page} total={total} onChange={setPage} />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <label className="flex items-center text-default-400 text-small">
          {rowsPerPageLabel}
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default TablePagination
