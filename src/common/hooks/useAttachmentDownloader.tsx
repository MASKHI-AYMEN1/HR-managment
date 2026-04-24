const useAttachmentDownloader = () => {
  function onDownloadAttachment(file: File) {
    const dataUrl = URL.createObjectURL(file)
    const downloadLink = document.createElement('a')

    downloadLink.href = dataUrl
    downloadLink.download = file.name

    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(dataUrl)
  }

  return {
    onDownloadAttachment,
  }
}

export default useAttachmentDownloader
