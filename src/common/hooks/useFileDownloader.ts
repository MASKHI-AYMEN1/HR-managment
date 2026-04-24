import AxiosInstance from '@/common/configuration/http'
import { useState } from 'react'

const useFileDownloader = (fileId: number, fileName: string) => {
  const [error, setError] = useState(null)

  const downloadFile = () => {
    AxiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/file/download/${fileId}`,
      {
        responseType: 'blob',
      }
    )
      .then((response) => {
        if (!response.status) {
          throw new Error('Error downloading file')
        }

        return response.data
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        setError(error)
      })
  }

  return { downloadFile, error }
}

export default useFileDownloader
