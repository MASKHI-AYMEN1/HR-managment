import {cn, Pagination, PaginationItemType} from "@heroui/react";

export const ChevronIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

interface PaginationProps {
  page: number;
  total: number;
  setPage: (page: number) => void;
  className?: string;
}

const PaginationComponent: React.FC<PaginationProps> = ({ page, total, setPage, className = '' }) => {
  const renderItem = ({ref, key, value, isActive, onNext, onPrevious, setPage: setPageItem, className: itemClassName}) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8 text-dark")}
          onClick={onPrevious}
        >
          <ChevronIcon className="text-dark"/>
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className&&"bg-default-200/50 min-w-8 w-8 h-8 text-dark"}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          isActive && "text-black bg-linear-to-br from-indigo-500 to-pink-500 font-bold w-7 rounded-full",
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      disableCursorAnimation
      showControls
      className={`gap-2 ${className}`}
      page={page}
      total={total}
      onChange={setPage}
      radius="full"
      renderItem={renderItem}
      variant="light"
    />
  );
}

export default PaginationComponent
