import { AxiosError, HttpStatusCode } from 'axios'
import {
  TIMEOUT_MESSAGE,
  UNEXPECTED_MESSAGE,
} from '../constants/httpErrorMessage'

function handleHttpError(err: AxiosError) {
  const { response } = err

  const expectedError =
    response &&
    response.status >= HttpStatusCode.BadRequest &&
    response.status < HttpStatusCode.InternalServerError

  return !expectedError ? UNEXPECTED_MESSAGE : (response?.data as string)
}

function getErrMessageResponse(err: AxiosError) {
  const isTimeoutError =
    err.code === 'ECONNABORTED' && err.message.includes('timeout')
  if (isTimeoutError) return TIMEOUT_MESSAGE

  return handleHttpError(err)
}

const AxiosUtil = {
  getErrMessageResponse,
}

export default AxiosUtil
