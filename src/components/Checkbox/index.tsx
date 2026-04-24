import React, { ReactNode } from 'react'
import { Checkbox } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'

interface CustomCheckboxProps {
  children: ReactNode
  control: Control<any, any>
  name: string
}

export default function index({
  children,
  control,
  name,
}: CustomCheckboxProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <Checkbox
            onChange={onChange}
            isSelected={value}
            radius="full"
            classNames={{
              base: 'inline-flex w-full dark:bg-transparent bg-transparent hover:bg-gray-50 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border  border-gray-100/10 data-[selected=true]:border-primary w-full  border-2',
              label: 'w-full',
              wrapper:
                'border border-black/50 data-[selected=true]:border-primary',
              icon: 'text-white rounded dark:text-black',
            }}
            size="sm"
          >
            {children}
          </Checkbox>
        )
      }}
    />
  )
}
