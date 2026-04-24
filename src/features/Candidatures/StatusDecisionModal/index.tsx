import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from '@heroui/react'
import { useIntl } from 'react-intl'
import Button from '@/components/Button'

export type DecisionPayload = {
  status: string
  sendEmail: boolean
  interviewDate: string | null
}

interface StatusDecisionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  candidatureName: string
  currentStatus?: string
  onConfirm: (data: DecisionPayload, onClose: () => void) => void
  isLoading?: boolean
}

export default function StatusDecisionModal({
  isOpen,
  onOpenChange,
  candidatureName,
  currentStatus = 'en_attente',
  onConfirm,
  isLoading = false,
}: StatusDecisionModalProps) {
  const intl = useIntl()

  const [status, setStatus] = useState(currentStatus)
  const [sendEmail, setSendEmail] = useState(false)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus)
      setSendEmail(false)
      setInterviewDate('')
      setInterviewTime('')
    }
  }, [isOpen, currentStatus])

  const handleConfirm = (onClose: () => void) => {
    let isoDatetime: string | null = null
    if ((status === 'accepter' || status === 'entretien') && interviewDate) {
      const time = interviewTime || '09:00'
      isoDatetime = `${interviewDate}T${time}:00`
    }
    onConfirm({ status, sendEmail, interviewDate: isoDatetime }, onClose)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-base font-semibold">
                {intl.formatMessage({
                  id: 'candidature.decisionTitle',
                  defaultMessage: 'Décision de candidature',
                })}
              </p>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {candidatureName}
              </p>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5">
              {/* Status checkboxes */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({
                    id: 'candidature.status',
                    defaultMessage: 'Statut',
                  })}
                </p>
                <div className="flex flex-col gap-2">
                  <Checkbox
                    isSelected={status === 'en_attente'}
                    onValueChange={() => setStatus('en_attente')}
                    color="warning"
                  >
                    <span className="text-sm text-warning-600">
                      {intl.formatMessage({
                        id: 'candidature.status.en_attente',
                        defaultMessage: 'En attente',
                      })}
                    </span>
                  </Checkbox>
                  <Checkbox
                    isSelected={status === 'accepter'}
                    onValueChange={() => setStatus('accepter')}
                    color="success"
                  >
                    <span className="text-sm text-success-600">
                      {intl.formatMessage({
                        id: 'candidature.status.accepter',
                        defaultMessage: 'Accepter',
                      })}
                    </span>
                  </Checkbox>
                  <Checkbox
                    isSelected={status === 'refuser'}
                    onValueChange={() => setStatus('refuser')}
                    color="danger"
                  >
                    <span className="text-sm text-danger-600">
                      {intl.formatMessage({
                        id: 'candidature.status.refuser',
                        defaultMessage: 'Refuser',
                      })}
                    </span>
                  </Checkbox>
                  <Checkbox
                    isSelected={status === 'entretien'}
                    onValueChange={() => setStatus('entretien')}
                    color="primary"
                  >
                    <span className="text-sm text-primary-600">
                      {intl.formatMessage({
                        id: 'candidature.status.entretien',
                        defaultMessage: 'Entretien',
                      })}
                    </span>
                  </Checkbox>
                </div>
              </div>

              {/* Interview date/time – only when accepted or interview */}
              {(status === 'accepter' || status === 'entretien') && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({
                      id: 'candidature.interviewDate',
                      defaultMessage: "Date et heure de l'entretien",
                    })}
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-36 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Email checkbox – only for accept/refuse */}
              {(status === 'accepter' || status === 'refuser') && (
                <Checkbox
                  isSelected={sendEmail}
                  onValueChange={setSendEmail}
                  color="warning"
                >
                  <span className="text-sm">
                    {intl.formatMessage({
                      id: 'candidature.sendEmail',
                      defaultMessage: 'Envoyer un email de notification au candidat',
                    })}
                  </span>
                </Checkbox>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="bordered" color="default" onClick={onClose}>
                {intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Annuler' })}
              </Button>
              <Button
                color={
                  status === 'accepter'
                    ? 'success'
                    : status === 'refuser'
                    ? 'danger'
                    : status === 'entretien'
                    ? 'primary'
                    : 'warning'
                }
                isLoading={isLoading}
                onClick={() => handleConfirm(onClose)}
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
