import React from 'react'
import { Textarea } from '@heroui/react'

interface CustomTextareaProps {
  name: string
  label: string
  value: string
  onChange: (e: string) => void
  placeholder: string
  errorMessage?: string
  isInvalid?: boolean
  type?: string
  rows?: number
}

function CustomTextarea({
  name,
  value,
  onChange,
  label,
  placeholder,
  errorMessage,
  isInvalid,
  type,
  rows,
  ...other
}: CustomTextareaProps) {
  return (
          <Textarea
            label={label}
            placeholder={placeholder}
            value={value}
            minRows={rows}
            onValueChange={onChange}
            errorMessage={errorMessage}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'warning'}
            variant="underlined"
            type={type}
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
}

const MyInput = React.forwardRef(CustomTextarea)

export default MyInput
