import React from 'react'
import { Select, SelectItem } from '@heroui/react'
import type { Key } from '@react-types/shared'
import { Control, Controller } from 'react-hook-form'
import { useDrawerPortal } from '@/components/Drawer/DrawerPortalContext'

interface CustomInputProps<T extends object> {
  name: string
  control: Control<any, any>
  label?: React.ReactNode
  placeholder?: string
  items: Iterable<T>
  getKey: (item: T) => Key
  getLabel: (item: T) => React.ReactNode
  errorMessage?: React.ReactNode | ((v: any) => React.ReactNode)
  isInvalid?: boolean
  selectionMode?: 'single' | 'multiple'
  selectedKeys?: 'all' | Iterable<Key>
  defaultSelectedKeys?: 'all' | Iterable<Key>
  disabledKeys?: Iterable<Key>
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  labelPlacement?: 'inside' | 'outside' | 'outside-left'
  description?: React.ReactNode
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  selectorIcon?: React.ReactNode
  isRequired?: boolean
  isDisabled?: boolean
  isMultiline?: boolean
  isClearable?: boolean
  validationState?: 'valid' | 'invalid'
  showScrollIndicators?: boolean
  autoFocus?: boolean
  disallowEmptySelection?: boolean
  disableAnimation?: boolean
  disableSelectorIconRotation?: boolean
  hideEmptyContent?: boolean
  popoverProps?: any
  listboxProps?: any
  scrollShadowProps?: any
  classNames?: Partial<Record<string, string>>
  onOpenChange?: (isOpen: boolean) => void
  onClose?: () => void
  onClear?: () => void
  onSelectionChange?: (keys: 'all' | Set<Key>) => void
  renderValue?: any
}

function MySelect<T extends object>({
  name,
  control,
  label,
  placeholder = '',
  items,
  getKey,
  getLabel,
  errorMessage,
  isInvalid,
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  disabledKeys,
  variant = 'flat',
  color = 'primary',
  size = 'md',
  radius = 'lg',
  labelPlacement = 'inside',
  description,
  startContent,
  endContent,
  selectorIcon,
  isRequired,
  isDisabled,
  isMultiline,
  isClearable,
  validationState,
  showScrollIndicators,
  autoFocus,
  disallowEmptySelection,
  disableAnimation,
  disableSelectorIconRotation,
  hideEmptyContent,
  popoverProps,
  listboxProps,
  scrollShadowProps,
  classNames,
  onOpenChange,
  onClose,
  onClear,
  onSelectionChange: externalOnSelectionChange,
  renderValue,
  ...other
}: CustomInputProps<T>) {
  const drawerPortalContainer = useDrawerPortal()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <Select
          label={label}
          placeholder={placeholder}
          selectionMode={selectionMode}
          selectedKeys={selectedKeys ?? (value ? new Set([value]) : new Set())}
          defaultSelectedKeys={defaultSelectedKeys}
          disabledKeys={disabledKeys}
          variant={variant}
          color={color}
          size={size}
          radius={radius}
          labelPlacement={labelPlacement}
          description={description}
          startContent={startContent}
          endContent={endContent}
          selectorIcon={selectorIcon}
          isRequired={isRequired}
          isDisabled={isDisabled}
          isMultiline={isMultiline}
          isClearable={isClearable}
          validationState={validationState}
          showScrollIndicators={showScrollIndicators}
          autoFocus={autoFocus}
          disallowEmptySelection={disallowEmptySelection}
          disableAnimation={disableAnimation}
          disableSelectorIconRotation={disableSelectorIconRotation}
          hideEmptyContent={hideEmptyContent}
          popoverProps={drawerPortalContainer ? { portalContainer: drawerPortalContainer, ...popoverProps } : popoverProps}
          listboxProps={listboxProps}
          scrollShadowProps={scrollShadowProps}
          classNames={
            classNames ?? {
              base: 'w-full',
              label: [
                'text-gray-600 dark:text-gray-400',
                'text-sm font-medium',
                'group-data-[filled=true]:text-gray-500 dark:group-data-[filled=true]:text-gray-400',
              ].join(' '),
              trigger: [
                isInvalid
                  ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                'border my-5',
                'rounded-xl',
                'shadow-none',
                'hover:border-yellow-400 dark:hover:border-yellow-500',
                'data-[open=true]:border-yellow-400 dark:data-[open=true]:border-yellow-500',
                'transition-colors',
              ].join(' '),
              innerWrapper: 'text-gray-800 dark:text-white',
              value: [
                isInvalid
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-900 dark:text-white',
                'text-sm',
              ].join(' '),
              selectorIcon: 'text-gray-400 dark:text-gray-500',
              popoverContent: [
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-xl shadow-lg',
                'p-0',
              ].join(' '),
              listboxWrapper: 'rounded-xl overflow-hidden',
              listbox: 'bg-white dark:bg-gray-800 p-1',
              helperWrapper: 'px-1 pt-1',
              description: 'text-xs text-gray-400 dark:text-gray-500',
              errorMessage: 'text-xs text-red-500 dark:text-red-400',
              clearButton: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300',
              endWrapper: 'text-gray-400 dark:text-gray-500',
            }
          }
          errorMessage={errorMessage}
          onBlur={onBlur}
          onOpenChange={onOpenChange}
          onClose={onClose}
          onClear={onClear}
          renderValue={renderValue}
          onSelectionChange={(keys) => {
            const keyArr = Array.from(keys as Set<React.Key>)
            onChange(keyArr[0] ?? '')
            externalOnSelectionChange?.(keys)
          }}
          {...other}
          items={items}
        >
          {(item: T) => (
            <SelectItem
              key={getKey(item) as Key}
              classNames={{
                base: [
                  'text-gray-900 dark:text-white',
                  'rounded-lg',
                  'data-[hover=true]:bg-white dark:data-[hover=true]:bg-gray-700',
                  'data-[selected=true]:bg-yellow-50 dark:data-[selected=true]:bg-yellow-900/20',
                  'data-[selected=true]:text-yellow-600 dark:data-[selected=true]:text-yellow-400',
                  'transition-colors',
                ].join(' '),
              }}
            >
              {getLabel(item)}
            </SelectItem>
          )}
        </Select>
      )}
    />
  )
}

// const CustomSelect = React.forwardRef(MySelect)

const CustomSelect = React.forwardRef(MySelect) as <T extends object>(
  props: CustomInputProps<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => ReturnType<typeof MySelect>
export default CustomSelect
