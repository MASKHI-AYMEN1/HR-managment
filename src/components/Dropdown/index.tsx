import React, { ReactNode, ReactElement } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  PopoverProps,
  DropdownMenuProps,
  DropdownProps,
} from '@heroui/react'
import { FaAngleDown } from 'react-icons/fa'

type DropdownMenuItem = {
  key: string
  label: string
  color?: 'danger' | 'default' | 'primary' | 'secondary' | 'success' | 'warning'
  className?: string
  isDisabled?: boolean
  description?: string | ReactNode
  shortcut?: string | ReactNode
  startContent?: ReactNode
  endContent?: ReactNode
}

type GeneralDropdownMenuProps = {
  items?: DropdownMenuItem[]
  children?: ReactNode | ((item: DropdownMenuItem) => ReactElement)
  buttonLabel: string
  buttonVariant?:
    | 'bordered'
    | 'shadow'
    | 'solid'
    | 'light'
    | 'flat'
    | 'faded'
    | 'ghost'
  ariaLabel?: string
  type?: 'menu' | 'listbox'
  trigger?: 'press' | 'longPress'
  isDisabled?: boolean
  closeOnSelect?: boolean
  shouldBlockScroll?: boolean
  popoverProps?: PopoverProps
  onOpenChange?: (isOpen: boolean) => void
  onClose?: () => void
  shouldCloseOnInteractOutside?: (e: HTMLElement) => void
  menuProps?: Partial<DropdownMenuProps>
  dropdownProps?: Partial<DropdownProps>
  onAction?: (key: React.Key) => void
  onSelectionChange?: (keys: any) => void
}

const DropdownMenuComponent: React.FC<GeneralDropdownMenuProps> = ({
  items,
  children,
  buttonLabel,
  buttonVariant = 'shadow',
  ariaLabel = 'Dynamic Actions',
  type = 'menu',
  trigger = 'press',
  isDisabled = false,
  closeOnSelect = true,
  shouldBlockScroll = true,
  popoverProps,
  onOpenChange,
  onClose,
  shouldCloseOnInteractOutside,
  menuProps = {},
  dropdownProps = {},
  onAction,
  onSelectionChange,
}) => {
  return (
    <Dropdown
      type={type}
      trigger={trigger}
      isDisabled={isDisabled}
      closeOnSelect={closeOnSelect}
      shouldBlockScroll={shouldBlockScroll}
      onOpenChange={onOpenChange}
      onClose={onClose}
      {...dropdownProps}
       classNames={
           {
              base: `dark:text-white bg-white text-black dark:bg-gray-800 `,
            }
          }
    >
      <DropdownTrigger>
        <Button variant={buttonVariant} endContent={<FaAngleDown />}
         className={
        'focus:ring-0 text-white text-small font-semibold disabled:bg-blue-100 bg-blue-500 dark:bg-blue-300 ' 
        
      }>
          {buttonLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={ariaLabel}
        items={items}
        onAction={onAction}
        onSelectionChange={onSelectionChange}
        closeOnSelect={closeOnSelect}
        classNames={
           {
              base: `dark:text-white bg-white text-black dark:bg-gray-800 dark:border-gray-700 `,
              list: 'text-black dark:text-white',
              emptyContent: 'text-black dark:text-white',
            }
          }
        {...menuProps}
      >
     {typeof children === 'function'
  ? children
  : (item: DropdownMenuItem) => (
      <DropdownItem
        key={item.key}
        color={item.color || (item.key === 'delete' ? 'danger' : 'primary')}
        isDisabled={item.isDisabled}
        description={item.description}
        shortcut={item.shortcut}
        startContent={item.startContent}
        endContent={item.endContent}
        classNames={
           {
              wrapper: `dark:text-white bg-white text-black dark:bg-gray-800 dark:border-gray-700 `,
            }
          }
      >
        {item.label}
      </DropdownItem>
    )}
      </DropdownMenu>
    </Dropdown>
  )
}

export default DropdownMenuComponent