import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'

interface CustomModalProps {
  title: string
  bodyContent: React.ReactNode
  buttonTitle: string
  footerContent: React.ReactNode
  endContent: React.ReactNode | undefined
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  bodyContent,
  buttonTitle,
  footerContent,
  endContent,
}) => {
  const [isOpen, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!isOpen)
  }

  return (
    <>
      <Button
        color="primary"
        onPress={() => handleOpen()}
        className="text-white capitalize"
        endContent={endContent}
      >
        {buttonTitle}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleOpen}
        classNames={{
          backdrop:
            'bg-gradient-to-t from-black/50 from-50% via-white/30  from-10% to-yellow-300/20 backdrop-opacity-100',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{bodyContent}</ModalBody>
              <ModalFooter>{footerContent}</ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CustomModal
