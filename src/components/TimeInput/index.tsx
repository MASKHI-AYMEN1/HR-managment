import React, { ReactNode } from 'react'
import { TimeInput } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  label: string
  errorMessage?: string
  isInvalid?: boolean
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  endContent?: ReactNode
}

function CustomTimeInput({
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
          <TimeInput
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
              inputWrapper: `${isInvalid ? 'border-red-300/50' : 'border-black/30'} `,
              input: 'text-black ',
              label: 'text-black/50 ',
            }}
            className=" rounded-xl font-semibold text-black "
            {...other}
          />
        )
      }}
    ></Controller>
  )
}

const MyTimeInput = React.forwardRef(CustomTimeInput)

export default MyTimeInput
