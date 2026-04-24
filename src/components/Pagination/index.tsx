import {
  cn,
  Pagination,
  PaginationItemType,
  PaginationItemRenderProps,
} from '@heroui/react'
import React, { FC } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

type PaginationProps = {
  page: number
  total: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const Index: FC<PaginationProps> = ({ page, total, setPage }) => {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
          onClick={onNext}
        >
          <IoIosArrowBack className="rotate-180" />
        </button>
      )
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
          onClick={onPrevious}
        >
          <IoIosArrowBack />
        </button>
      )
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      )
    }

    return (
      <button
        key={key}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          className,
          isActive &&
            'text-white bg-gradient-to-br from-blue-300 to-blue-200 font-bold rounded-full'
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    )
  }

  return (
    <>
      <Pagination
        showControls
        disableCursorAnimation
        showShadow
        className="gap-2 "
        radius="full"
        variant="light"
        initialPage={1}
        renderItem={renderItem}
        page={page}
        total={total}
        onChange={setPage}
      />
    </>
  )
}

export default Index
