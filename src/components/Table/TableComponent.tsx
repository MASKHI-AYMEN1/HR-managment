import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react'
import { FormattedMessage } from 'react-intl';
import TableLoader from './TableLoading';

interface TableComponentProps<T> {
  columns: Array<{ uid: string; name: string; sortable?: boolean }>
  items: T[]
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode
  topContent?: React.ReactNode
  bottomContent?: React.ReactNode
  sortDescriptor?: any
  onSortChange?: (desc: any) => void
  classNames?: any
  emptyContent?: string
  isLoading?: boolean
}

function TableComponent<T>({
  columns,
  items,
  renderCell,
  topContent,
  bottomContent,
  sortDescriptor,
  onSortChange,
  classNames,
  emptyContent,
  isLoading=false,
}: TableComponentProps<T>) {
  return (
    <Table
      removeWrapper
      aria-label="Table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        base: 'bg-transparent dark:bg-gray-900 h-full min-h-[600px]',
        // table: 'bg-transparent dark:bg-gray-900 h-full min-h-[700px]',
        thead: '[&>tr]:!bg-transparent',
        tbody: 'bg-transparent dark:bg-gray-900',
        th: [
          'bg-transparent dark:bg-gray-800',
          'text-gray-600 dark:text-gray-300',
          'font-semibold text-xs uppercase tracking-wide',
          'border-b border-gray-200 dark:border-gray-700',
          'first:rounded-s-lg last:rounded-e-lg',
        ].join(' '),
        tr: [
          'bg-transparent dark:bg-gray-900',
          'border-b border-gray-100 dark:border-gray-800',
          'hover:bg-gray-50 dark:hover:bg-gray-800/60',
          'transition-colors',
        ].join(' '),
        td: [
          'bg-transparent',
          'text-gray-800 dark:text-gray-200',
          'py-3',
        ].join(' '),
        wrapper: 'bg-transparent dark:bg-gray-900',
        emptyWrapper: 'bg-transparent dark:bg-gray-900 h-full text-gray-400 dark:text-gray-500',
        loadingWrapper: 'bg-transparent dark:bg-gray-900 h-full p-5',
        ...classNames,
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={onSortChange}
    >
      <TableHeader columns={columns} className='bg-white dark:bg-black-900 '>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'start' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={emptyContent||(<FormattedMessage id='table.emptyContent'/>)} items={items} isLoading={isLoading} loadingContent={<TableLoader/>}>
        {(item) => (
          <TableRow key={(item as any).id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TableComponent
