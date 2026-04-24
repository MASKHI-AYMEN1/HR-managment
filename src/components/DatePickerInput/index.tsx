import React, { ReactNode } from 'react'
import { DatePicker } from '@heroui/react'
import { Control, Controller } from 'react-hook-form'
import {
  CalendarDate,
  CalendarDateTime,
  parseDateTime,
  ZonedDateTime,
} from '@internationalized/date'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  label: string
  errorMessage?: string
  isInvalid?: boolean
  defaultDate: ZonedDateTime | CalendarDate
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  endContent?: ReactNode
}

function CustomDatePickerInput({
  name,
  control,
  label,
  errorMessage,
  isInvalid,
  variant = 'underlined',
  endContent,
  defaultDate,
  ...other
}: CustomInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const dateValue = value
          ? typeof value === 'string'
            ? parseDateTime(value)
            : value
          : defaultDate

        return (
          <div className="bg-background-date">
            <DatePicker
              label={label}
              value={dateValue}
              onChange={(
                e: CalendarDate | CalendarDateTime | ZonedDateTime
              ) => {
                let isoDate = ''

                if ('year' in e && 'month' in e && 'day' in e) {
                  isoDate = `${e.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`

                  if ('hour' in e && 'minute' in e) {
                    isoDate += `T${String(e.hour).padStart(2, '0')}:${String(e.minute).padStart(2, '0')}`
                  }

                  if ('zone' in e) {
                    const offset = e.zone ?? ''
                    isoDate += `${offset}`
                  }
                }

                onChange(isoDate)
              }}
              errorMessage={errorMessage}
              isInvalid={isInvalid}
              color={isInvalid ? 'danger' : 'primary'}
              variant={variant}
              onBlur={onBlur}
              hideTimeZone
              showMonthAndYearPickers
              endContent={endContent}
              classNames={{
                base: `${isInvalid ? 'border-red-300/50' : 'border-black/10 '} `,
                timeInput: 'text-black ',
                label: 'text-black',
                calendarContent: 'text-black/50 ',
                selectorIcon: 'text-black/50  ',
                timeInputLabel: 'text-black ',
              }}
              className="rounded-xl font-semibold border-b-0.5"
              {...other}
            />
          </div>
        )
      }}
    />
  )
}

const MyDatePickerInput = React.forwardRef(CustomDatePickerInput)

export default MyDatePickerInput
