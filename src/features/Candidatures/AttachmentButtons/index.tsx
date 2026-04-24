import React from 'react'
import IconButton from '@/components/IconButton'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import { FaFileDownload } from 'react-icons/fa'
import { RiFolderDownloadFill } from 'react-icons/ri'

interface AttachmentButtonsProps {
  candidatureId: string
}

export default function AttachmentButtons({ candidatureId }: AttachmentButtonsProps) {
  const { useListAttachments, useDownloadFile } = useCandidatureApi()
  const { data: attachments = [], isLoading } = useListAttachments(candidatureId)
  const { mutate: downloadFile, isPending: isDownloading } = useDownloadFile()

  if (isLoading) return <span className="text-xs text-gray-400">…</span>
  if (!attachments.length) return <span className="text-xs text-gray-400">-</span>

  const cv = attachments.find((a: any) => a.fileType === 'cv')
  const letter = attachments.find((a: any) => a.fileType === 'lettre_motivation')

  return (
    <div className="flex gap-2 flex-wrap">
      {cv && (
        <IconButton
          size="sm"
          color="warning"
          isDisabled={isDownloading}
          onClick={() => downloadFile({ attachmentId: cv.id, fileName: cv.fileName })}
        >
          <FaFileDownload size={14} />
        </IconButton>
      )}
      {letter && (
        <IconButton
          size="sm"
          color="primary"
          isDisabled={isDownloading}
          onClick={() => downloadFile({ attachmentId: letter.id, fileName: letter.fileName })}
        >
          <RiFolderDownloadFill size={14} />
        </IconButton>
      )}
    </div>
  )
}
