import React, { forwardRef, useState, DragEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  ACCEPTED_ATTACHMENT_MIME_TYPES,
  MAXSIZE,
} from '@/common/constants/acceptedFile'
import { GrAttachment } from 'react-icons/gr'
import { TiDeleteOutline } from 'react-icons/ti'
import {
  FORMAT_ATTACHMENT_ERROR,
  SIZE_ATTACHMENT_ERROR,
} from '@/common/constants/errorMessage'

interface CustomInputProps {
  name: string
  control: Control<any, any>
  errorMessage?: string
  isInvalid?: boolean
  resetFileField: () => void
  type?: string
}

function CustomInput({
  name,
  control,
  errorMessage,
  isInvalid,
  resetFileField,
  type = 'IMAGE',
}: CustomInputProps) {
  const [previewSrc, setPreviewSrc] = useState<string>('')
  const [previewName, setPreviewName] = useState<string>('')
  const [dragging, setDragging] = useState<boolean>(false)
  const [fileError, setFileError] = useState<string>('')

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    validateFile(file)
  }

  const validateFile = (file: File) => {
    if (!ACCEPTED_ATTACHMENT_MIME_TYPES.includes(file.type)) {
      setFileError(FORMAT_ATTACHMENT_ERROR)

      return false
    }
    if (file.size > MAXSIZE) {
      setFileError(SIZE_ATTACHMENT_ERROR)

      return false
    }
    setFileError('')
    displayPreview(file)

    return true
  }

  const displayPreview = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreviewSrc(reader.result as string)
    }
    setPreviewName(file.name)
  }

  const handleReset = () => {
    setPreviewName('')
    setPreviewSrc('')
    resetFileField()
    setFileError('')
  }

  return (
    <div className="w-[800px]">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, name } }) => {
          return (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 ${
                isInvalid
                  ? 'border-red-500'
                  : dragging
                    ? 'border-blue-400'
                    : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 z-50"
                onChange={(event) => {
                  const files = event.target.files
                  if (files && files.length > 0) {
                    const isValid = validateFile(files[0])
                    if (isValid) {
                      onChange(files[0])
                    }
                  }
                }}
                name={name}
              />
              <div className="text-center">
                <img
                  className="mx-auto h-12 w-12"
                  src="https://www.svgrepo.com/show/357902/image-upload.svg"
                  alt=""
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer"
                  >
                    <span>Glisser déposer</span>
                    <span className="text-blue-300"> ou parcourir</span>
                    <span> télécharger</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {"PDF, Word, PNG, JPG jusqu'à 10MB"}
                </p>
              </div>
            </div>
          )
        }}
      />
      {type === 'IMAGE' ? (
        <>
          {previewSrc && (
            <img
              src={previewSrc}
              className="mt-4 mx-auto max-h-40"
              alt="Preview"
            />
          )}
        </>
      ) : (
        <>
          {previewName && (
            <div
              className={`flex justify-start items-center space-x-2 w-full border-2 rounded-lg p-2 my-2 ${
                isInvalid
                  ? 'border-red-500'
                  : dragging
                    ? 'border-yellow-400'
                    : 'border-gray-200'
              }`}
            >
              <GrAttachment
                className={`${isInvalid ? 'text-red-300' : 'text-yellow-300'}`}
              />
              <p
                className={`${isInvalid ? 'text-red-300' : 'text-yellow-300'} flex-1 w-full `}
              >
                {previewName}
              </p>
              <TiDeleteOutline
                className={`${isInvalid ? 'text-red-300' : 'text-yellow-300'}`}
                onClick={handleReset}
              />
            </div>
          )}
        </>
      )}
      {fileError && (
        <div>
          <p className="text-red-300 text-sm font-semibold">{fileError}</p>
        </div>
      )}
      <div>
        <p className="text-red-300 text-lg font-semibold">{errorMessage}</p>
      </div>
    </div>
  )
}

const CustomFileInput = forwardRef(CustomInput)

export default CustomFileInput
