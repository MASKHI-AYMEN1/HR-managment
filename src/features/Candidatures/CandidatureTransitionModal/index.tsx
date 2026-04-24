import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Radio,
  RadioGroup,
} from '@heroui/react'
import { useIntl } from 'react-intl'
import Button from '@/components/Button'

export type TransitionPayload = {
  action: 'accepter' | 'refuser'
  sendEmail: boolean
  interviewDate: string | null
}

interface CandidatureTransitionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  candidatureName: string
  currentStatus: string
  availableActions: string[]
  onConfirm: (data: TransitionPayload, onClose: () => void) => void
  isLoading?: boolean
}

export default function CandidatureTransitionModal({
  isOpen,
  onOpenChange,
  candidatureName,
  currentStatus,
  availableActions,
  onConfirm,
  isLoading = false,
}: CandidatureTransitionModalProps) {
  const intl = useIntl()

  const [action, setAction] = useState<'accepter' | 'refuser'>('accepter')
  const [sendEmail, setSendEmail] = useState(false)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAction(availableActions.includes('accepter') ? 'accepter' : 'refuser')
      setSendEmail(false)
      setInterviewDate('')
      setInterviewTime('')
    }
  }, [isOpen, availableActions])

  const handleConfirm = (onClose: () => void) => {
    let isoDatetime: string | null = null
    if (action === 'accepter' && interviewDate) {
      const time = interviewTime || '09:00'
      isoDatetime = `${interviewDate}T${time}:00`
    }
    onConfirm({ action, sendEmail, interviewDate: isoDatetime }, onClose)
  }

  // Traduire le statut actuel
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En attente',
      evaluation_rh: 'Évaluation RH',
      evaluation_technique: 'Évaluation Technique',
      evaluation_manager: 'Évaluation Manager',
      refuse: 'Refusé',
      refuse_evaluation_rh: 'Refusé - Évaluation RH',
      refuse_evaluation_technique: 'Refusé - Évaluation Technique',
      refuse_evaluation_manager: 'Refusé - Évaluation Manager',
      accepte: 'Accepté',
    }
    return labels[status] || status
  }

  const canAccept = availableActions.includes('accepter')
  const canRefuse = availableActions.includes('refuser')

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-base font-semibold">
                {intl.formatMessage({
                  id: 'candidature.transitionTitle',
                  defaultMessage: 'Décision de candidature',
                })}
              </p>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {candidatureName}
              </p>
              <p className="text-xs font-normal text-gray-400 dark:text-gray-500">
                Statut actuel : <span className="font-medium">{getStatusLabel(currentStatus)}</span>
              </p>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5">
              {/* Actions disponibles */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({
                    id: 'candidature.chooseAction',
                    defaultMessage: 'Choisir une action',
                  })}
                </p>
                <RadioGroup value={action} onValueChange={(v) => setAction(v as 'accepter' | 'refuser')}>
                  {canAccept && (
                    <Radio value="accepter" color="success">
                      <span className="text-sm text-success-600 font-medium">
                        {intl.formatMessage({
                          id: 'candidature.action.accepter',
                          defaultMessage: 'Accepter',
                        })}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {currentStatus === 'en_attente' && 'Passer à l\'évaluation RH'}
                        {currentStatus === 'evaluation_rh' && 'Passer à l\'évaluation technique'}
                        {currentStatus === 'evaluation_technique' && 'Passer à l\'évaluation manager'}
                        {currentStatus === 'evaluation_manager' && 'Accepter la candidature'}
                      </p>
                    </Radio>
                  )}
                  {canRefuse && (
                    <Radio value="refuser" color="danger">
                      <span className="text-sm text-danger-600 font-medium">
                        {intl.formatMessage({
                          id: 'candidature.action.refuser',
                          defaultMessage: 'Refuser',
                        })}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Refuser la candidature
                      </p>
                    </Radio>
                  )}
                </RadioGroup>
              </div>

              {/* Interview date/time – only when accepting */}
              {action === 'accepter' && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({
                      id: 'candidature.interviewDate',
                      defaultMessage: "Date et heure de l'entretien (optionnel)",
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

              {/* Email checkbox */}
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
            </ModalBody>

            <ModalFooter>
              <Button variant="bordered" color="default" onClick={onClose}>
                {intl.formatMessage({ id: 'button.cancel', defaultMessage: 'Annuler' })}
              </Button>
              <Button
                color={action === 'accepter' ? 'success' : 'danger'}
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
