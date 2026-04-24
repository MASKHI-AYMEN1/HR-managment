import React from 'react'
import { Select, SelectItem } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'

interface CustomInputProps<T> {
  name: string
  control: Control<any, any>
  label: string
  placeholder: string
  data: T[]
  getKey: (item: T) => number
  getLabel: (item: T) => string
  errorMessage?: string
  isInvalid?: boolean
}

function MySelect<T>({
  name,
  control,
  label,
  placeholder,
  data,
  getKey,
  getLabel,
  errorMessage,
  isInvalid,
  ...other
}: CustomInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleSelectionChange = (
          e: React.ChangeEvent<HTMLSelectElement>
        ) => {
          onChange(e.target.value)
        }
        const formatNumbers = (input: string) => {
          const numbers = input.match(/\d+/g)?.map(Number) || []
          const validNumbers = numbers.filter(
            (num) => num !== undefined && num !== null
          )
          const numberStrings = validNumbers.map((num) => num.toString())

          return numberStrings
        }

        return (
          <Select
            key={label}
            label={label}
            variant="underlined"
            placeholder={placeholder}
            selectedKeys={value ? new Set(formatNumbers(value)) : []}
            errorMessage={errorMessage}
            selectionMode="multiple"
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'default'}
            radius={'lg'}
            onBlur={onBlur}
            className=" rounded-xl font-semibold text-black dark:text-white"
            onChange={handleSelectionChange}
            {...other}
          >
            {data.map((item) => (
              <SelectItem
                key={getKey(item)}
                value={getKey(item)}
                className="dark:text-white"
              >
                {getLabel(item)}
              </SelectItem>
            ))}
          </Select>
        )
      }}
    ></Controller>
  )
}

// const CustomSelectMultiple = React.forwardRef(MySelect)

const CustomSelectMultiple = React.forwardRef(MySelect) as <T>(
  props: CustomInputProps<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => ReturnType<typeof MySelect>
export default CustomSelectMultiple
