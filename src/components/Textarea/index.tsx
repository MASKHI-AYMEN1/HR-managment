import React from 'react'
import { Textarea } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'

interface CustomTextareaProps {
  name: string
  control: Control<any, any>
  label: string
  placeholder: string
  errorMessage?: string
  isInvalid?: boolean
  type?: string
  rows?: number
}

function CustomTextarea({
  name,
  control,
  label,
  placeholder,
  errorMessage,
  isInvalid,
  type,
  rows,
  ...other
}: CustomTextareaProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <Textarea
            label={label}
            placeholder={placeholder}
            value={value}
            minRows={rows}
            onChange={onChange}
            errorMessage={errorMessage}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
            variant="underlined"
            type={type}
            onBlur={onBlur}
            classNames={{
              base: 'dark:border-white/50 dark:border-b dark:rounded-none',
              mainWrapper: 'focus-within:!text-red-300',
              inputWrapper: `${isInvalid ? 'border-red-300/50' : 'border-black/10 border-b-0.5 focus-within:!text-red-300'}   `,
              input: 'text-black',
              label:
                'text-black/50 focus:text-white after:text-red-300 focus-within:!text-red-300 dark:text-white',
            }}
            className=" rounded-xl font-semibold"
            {...other}
          />
        )
      }}
    ></Controller>
  )
}

const MyInput = React.forwardRef(CustomTextarea)

export default MyInput
