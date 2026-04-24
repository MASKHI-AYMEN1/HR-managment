import React from "react"
import TableComponent from "./TableComponent"
import TablePagination from "./TablePagination"
import SearchInput from "@/components/SearchInput"
import DropdownMenuComponent from "@/components/Dropdown"
import Button from "@/components/Button"
import { SearchIcon } from "@/assets/icons/SeachIcon"
import { PlusIcon } from "@/assets/icons/PlusIcon"
import { Selection, SortDescriptor } from "@heroui/react"
import { FormattedMessage } from "react-intl"
import { PaginatedData } from "@/common/types/CustomResponse"


type GenericTableProps<T> = {
  data: PaginatedData<T>
  columns: { uid: string; name: string }[]
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode
  visibleColumns?: string[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  onAdd?: () => void
  addButtonLabel?: string
  sortDescriptor?: SortDescriptor
  onSortChange?: (descriptor: SortDescriptor) => void
  onPageChange?: (page: number) => void
  onRowsPerPageChange?: (size: number) => void
  isLoading?: boolean
}

export default function GenericTable<T>({
  data,
  columns,
  renderCell,
  visibleColumns = [],
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Search...",
  onAdd,
  addButtonLabel,
  sortDescriptor,
  onSortChange,
  onPageChange,
  onRowsPerPageChange,
  isLoading,
}: GenericTableProps<T>) {
  const headerColumns = React.useMemo(() => {
    return visibleColumns.length === 0
      ? columns
      : columns.filter((c) => visibleColumns.includes(c.uid))
  }, [columns, visibleColumns.join(",")])

  const handleClearFilter = React.useCallback(() => onFilterChange?.(""), [onFilterChange])
  const handleFilterChange = React.useCallback((value?: string) => onFilterChange?.(value ?? ""), [onFilterChange])

  const topContent = React.useMemo(
    () => (
      <div className="flex justify-between gap-3 items-end mb-4">
        {onFilterChange && (
          <SearchInput
            placeholder={filterPlaceholder}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={handleClearFilter}
            onChange={handleFilterChange}
          />
        )}
        {onAdd && (
          <Button color="warning" onClick={onAdd} endContent={<PlusIcon />}>
            {addButtonLabel}
          </Button>
        )}
      </div>
    ),
    [filterValue, onAdd, addButtonLabel, handleClearFilter, handleFilterChange]
  )

  const bottomContent = React.useMemo(
    () =>
      data?.totalPages > 1 ? (
        <TablePagination
          page={data.pageNumber}
          total={data.totalPages}
          setPage={onPageChange ?? (() => {})}
          itemsLength={data.totalCount}
          rowsPerPage={data.pageSize}
          onRowsPerPageChange={onRowsPerPageChange ?? (() => {})}
          rowsPerPageLabel={<FormattedMessage id="table.rowsPerPage" />}
        />
      ) : null,
    [data, onPageChange, onRowsPerPageChange]
  )

  return (
    <TableComponent
      columns={headerColumns}
      items={data?.items || data || []}
      renderCell={renderCell}
      topContent={topContent}
      bottomContent={bottomContent}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
      isLoading={isLoading}
    />
  )
}

