import {
  ACCEPTED_ATTACHMENT_MIME_TYPES,
  MAXSIZE,
} from '../constants/acceptedFile'
import {
  FORMAT_ATTACHMENT_ERROR,
  SIZE_ATTACHMENT_ERROR,
} from '../constants/errorMessage'

function validateFile(file: File): boolean {
  const isAcceptedType = ACCEPTED_ATTACHMENT_MIME_TYPES.includes(file.type)
  const isWithinSizeLimit = file.size > 0 && file.size < MAXSIZE

  return isAcceptedType && isWithinSizeLimit
}

function checkFilesSize(files: File[]): boolean {
  return files.every((file) => 'size' in file && file.size < MAXSIZE)
}

function checkFilesFormat(files: File[]): boolean {
  return files.every(
    (file) =>
      'type' in file && ACCEPTED_ATTACHMENT_MIME_TYPES.includes(file.type)
  )
}
function checkFileSize(file: File | undefined): boolean {
  return file !== undefined && file.size < MAXSIZE
}

function checkFileFormat(file: File | undefined): boolean {
  return (
    file !== undefined && ACCEPTED_ATTACHMENT_MIME_TYPES.includes(file.type)
  )
}

function filesValidation(files: File[]): boolean | string {
  const sizeValid = checkFilesSize(files)
  const formatValid = checkFilesFormat(files)

  if (!sizeValid) {
    return SIZE_ATTACHMENT_ERROR
  }

  if (!formatValid) {
    return FORMAT_ATTACHMENT_ERROR
  }

  return true
}

function fileValidation(file: File | undefined): boolean | string {
  if (file) {
    const sizeValid = checkFilesSize([file])
    const formatValid = checkFilesFormat([file])

    if (!sizeValid) {
      return SIZE_ATTACHMENT_ERROR
    }

    if (!formatValid) {
      return FORMAT_ATTACHMENT_ERROR
    }
  }

  return true
}

function humanFileSize(bytes: number | undefined): string {
  const sizes = ['bytes', 'kb', 'mb']

  if (!bytes) return '0 byte'

  const sizeIndex = parseInt(
    Math.floor(Math.log(bytes) / Math.log(1024)).toString()
  )
  const sizeInFormattedUnit =
    Math.round((bytes / Math.pow(1024, sizeIndex)) * 100) / 100
  const formattedSize = sizeInFormattedUnit + ' ' + sizes[sizeIndex]

  return formattedSize
}

function generateFakeFiles(length: number): File[] {
  return Array.from({ length }, (_, index) => {
    return new File([''], `filename${index}.txt`)
  })
}

const FileUtil = {
  validateFile,
  checkFileSize,
  checkFilesFormat,
  fileValidation,
  filesValidation,
  checkFileFormat,
  humanFileSize,
  generateFakeFiles,
}

export default FileUtil
