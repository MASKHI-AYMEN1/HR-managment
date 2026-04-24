import React, { FC, useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@heroui/react'
import { MdDeleteOutline } from 'react-icons/md'
import useToast from '@/common/hooks/useToast'
import { defaultToastOption } from '@/common/constants/defaultToastOption'
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '@/common/constants/toastMessages'
import { UseMutateFunction } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import IconButton from '../IconButton'
import { FiTrash2 } from 'react-icons/fi'
import FormattedText from '../FormattedText'

interface DeleteModalProps {
  id: string
  buttonOpen?: boolean
  toggle?: () => void
  mutate: UseMutateFunction<void, Error, string, unknown>
  path?: string
  isPending?: boolean
}

const DeleteModal: FC<DeleteModalProps> = ({
  id,
  buttonOpen = false,
  toggle,
  mutate,
  isPending,
  path,
}) => {
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { showToast } = useToast()

  useEffect(() => {
    if (buttonOpen) {
      onOpen()
    }
  }, [buttonOpen, onOpen])

  const showSuccessToast = () => {
    showToast({
      type: 'success',
      message: SUCCESS_MESSAGE,
      data: {
        ...defaultToastOption,
        description: SUCCESS_MESSAGE,
      },
    })
  }

  const showErrorToast = () => {
    showToast({
      type: 'error',
      message: 'Error',
      data: {
        ...defaultToastOption,
        description: ERROR_MESSAGE,
      },
    })
  }

  const handleNavigate = () => {
    if (path) router.push(path)
  }

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        onOpenChange()
        showSuccessToast()
        if (toggle) {
          handleNavigate()
          toggle()
        }
      },
      onError: () => {
        showErrorToast()
      },
    })
  }

  return (
    <>
         <IconButton
              onClick={onOpen}
              color="danger"
            >
              <FiTrash2 />
            </IconButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='bg-white dark:bg-black'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <FormattedText id="deleteModal.attention" defaultMessage="Attention !" />
              </ModalHeader>
              <ModalBody>
                  <FormattedText id="deleteModal.confirmation" defaultMessage="
                êtes-vous sûr de vouloir supprimer cet objet ?"/>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onPress={() => {
                    if (toggle) toggle()
                    onClose()
                  }}
                >
                  FERMER
                </Button>
                <Button
                  color="danger"
                  className="text-white"
                  onPress={handleDelete}
                  isLoading={isPending}
                >
                  SUPPRIMER
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteModal
