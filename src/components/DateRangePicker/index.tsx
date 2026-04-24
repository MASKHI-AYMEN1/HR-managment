import React, { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'
import { DateRangePicker } from '@heroui/react'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  label: string
  errorMessage?: string
  isInvalid?: boolean
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  endContent?: ReactNode
}

function CustomDateRangePickerInput({
  name,
  control,
  label,
  errorMessage,
  isInvalid,
  variant = 'underlined',
  endContent,
  ...other
}: CustomInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <DateRangePicker
            fullWidth
            granularity="second"
            label={label}
            value={value}
            onChange={onChange}
            errorMessage={errorMessage}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
            variant={variant}
            onBlur={onBlur}
            endContent={endContent}
            classNames={{
              base: 'data-hover:text-white',
              inputWrapper: `${isInvalid ? 'border-red-300/50' : 'border-black/10 border-b-0.5 focus-within:!text-red-300'}   `,
              input: 'text-black',
              label:
                'text-black/50 focus:text-white after:text-red-300 focus-within:!text-red-300 ',
            }}
            className=" rounded-xl font-semibold text-blue-300 "
            {...other}
          />
        )
      }}
    ></Controller>
  )
}

const MyDateRangePickerInput = React.forwardRef(CustomDateRangePickerInput)

export default MyDateRangePickerInput
