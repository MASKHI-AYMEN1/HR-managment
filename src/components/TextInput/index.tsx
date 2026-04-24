import React, { ReactNode } from 'react'
import { Input } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  label: string
  placeholder: string
  errorMessage?: string
  isInvalid?: boolean
  type?: string
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  endContent?: ReactNode
  disable?: boolean
}

function CustomInput({
  name,
  control,
  label,
  placeholder,
  errorMessage,
  isInvalid,
  variant = 'underlined',
  type,
  endContent,
  disable,
  ...other
}: CustomInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            errorMessage={errorMessage}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'warning'}
            variant={variant}
            type={type}
            onBlur={onBlur}
            endContent={endContent}
            classNames={{
              base: 'dark:border-white/50 dark:border-b dark:rounded-none',
              mainWrapper: 'focus-within:!text-red-300',
              inputWrapper: `${isInvalid ? 'border-red-300/50' : 'border-black/10 border-b-0.5 focus-within:!text-red-300'}   `,
              input: 'text-black dark:text-white',
              label:
                'text-black/50 focus:text-white after:text-red-300 focus-within:!text-red-300 dark:text-white',
            }}
            className=" rounded-xl font-semibold text-yellow-300 "
            disabled={disable}
            {...other}
          />
        )
      }}
    ></Controller>
  )
}

const MyInput = React.forwardRef(CustomInput)

export default MyInput
