import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { useIntl } from 'react-intl'
import Button from '@/components/Button'

interface CloseOfferModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (onClose: () => void) => void
  isLoading?: boolean
}

export default function CloseOfferModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: CloseOfferModalProps) {
  const intl = useIntl()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-danger">
              {intl.formatMessage({
                id: 'offer.closeConfirmTitle',
                defaultMessage: "Clôturer l'offre",
              })}
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {intl.formatMessage({
                  id: 'offer.closeConfirmMessage',
                  defaultMessage:
                    'Êtes-vous sûr de vouloir clôturer cette offre ? Les candidats ne pourront plus postuler.',
                })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" color="default" onClick={onClose}>
                {intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Annuler' })}
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onClick={() => onConfirm(onClose)}
              >
                {intl.formatMessage({ id: 'button.confirm', defaultMessage: 'Confirmer' })}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
