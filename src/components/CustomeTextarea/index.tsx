import React from 'react'
import { Textarea } from '@heroui/react'

interface CustomTextAreaProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  errorMessage?: string
  isInvalid?: boolean
  rows?: number
}

export default function index({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  isInvalid,
  rows,
  ...other
}: CustomTextAreaProps) {
  return (
    <div>
      <Textarea
        label={label}
        placeholder={placeholder}
        value={value}
        minRows={rows}
        onValueChange={onChange}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        color={isInvalid ? 'danger' : 'default'}
        variant="bordered"
        className="bg-white rounded-xl font-semibold"
        {...other}
      />
    </div>
  )
}
