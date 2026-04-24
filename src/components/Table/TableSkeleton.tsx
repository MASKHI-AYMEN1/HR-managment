import React from "react"

type TableSkeletonProps = {
  rows?: number
  columns?: number
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-4 mb-2">
        {Array.from({ length: columns }).map((_, idx) => (
          <div
            key={idx}
            className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 mb-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-full"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
