import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react'
import { useIntl } from 'react-intl'
import Button from '@/components/Button'
import AttachmentButtons from '@/features/Candidatures/AttachmentButtons'
import { Candidature } from '@/features/Candidatures/CandidaturesTable'

export const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: 'bg-warning-100 text-warning-700' },
  accepter:   { label: 'Accepter',   color: 'bg-success-100 text-success-700' },
  refuser:    { label: 'Refuser',    color: 'bg-danger-100 text-danger-700'  },
  entretien:  { label: 'Entretien',  color: 'bg-primary-100 text-primary-700' },
}

interface CandidatureDetailModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  candidature: Candidature | null
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 dark:text-gray-100">{value || '-'}</span>
    </div>
  )
}

export default function CandidatureDetailModal({
  isOpen,
  onOpenChange,
  candidature,
}: CandidatureDetailModalProps) {
  const intl = useIntl()

  if (!candidature) return null

  const s = candidature.status || 'en_attente'
  const meta = STATUS_LABEL[s] ?? STATUS_LABEL['en_attente']

  const interviewFormatted = candidature.interviewDate
    ? new Date(candidature.interviewDate).toLocaleString()
    : null

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-lg font-bold">
                {candidature.firstName} {candidature.lastName}
              </p>
              <span
                className={`self-start px-2 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}
              >
                {intl.formatMessage({
                  id: `candidature.status.${s}`,
                  defaultMessage: meta.label,
                })}
              </span>
            </ModalHeader>

            <ModalBody className="grid grid-cols-2 gap-5">
              <Row
                label={intl.formatMessage({ id: 'candidature.firstName', defaultMessage: 'Prénom' })}
                value={candidature.firstName}
              />
              <Row
                label={intl.formatMessage({ id: 'candidature.lastName', defaultMessage: 'Nom' })}
                value={candidature.lastName}
              />
              <Row
                label={intl.formatMessage({ id: 'candidature.email', defaultMessage: 'Email' })}
                value={candidature.email}
              />
              <Row
                label={intl.formatMessage({ id: 'candidature.phone', defaultMessage: 'Téléphone' })}
                value={candidature.phone}
              />
              <Row
                label={intl.formatMessage({ id: 'candidature.dateNaissance', defaultMessage: 'Date de naissance' })}
                value={candidature.dateNaissance}
              />
              <Row
                label="Date de candidature"
                value={
                  candidature.createdAt
                    ? new Date(candidature.createdAt).toLocaleDateString()
                    : undefined
                }
              />
              {interviewFormatted && (
                <Row
                  label={intl.formatMessage({
                    id: 'candidature.interviewDate',
                    defaultMessage: "Date d'entretien",
                  })}
                  value={interviewFormatted}
                />
              )}
              <div className="col-span-2 flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Pièces jointes
                </span>
                <AttachmentButtons candidatureId={candidature.id} />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="default" variant="bordered" onClick={onClose}>
                {intl.formatMessage({ id: 'button.close', defaultMessage: 'Fermer' })}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
