import React from 'react'
import { Control, Controller } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  errorMessage?: string
  isInvalid?: boolean
  disable?: boolean
}
function CustomPhoneInput({
  name,
  control,
  errorMessage,
  isInvalid,
  disable,
  ...other
}: CustomInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <>
            <PhoneInput
              placeholder="Entrez le numéro de téléphone"
              value={value}
              className="my-4 w-full border-b-2 focus:ring-blue-300 border-gray-100/70 focus:outline-none focus:border-blue-300 transition duration-300 ease-in-out py-2"
              onChange={onChange}
              disabled={disable}
              {...other}
            />
            {isInvalid && (
              <div>
                <span className="text-red-300 text-sm">{errorMessage}</span>
              </div>
            )}
          </>
        )
      }}
    ></Controller>
  )
}

const MyPhoneInput = React.forwardRef(CustomPhoneInput)

export default MyPhoneInput
