import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea } from '@heroui/react'
import Button from '@/components/Button'
import Typography from '@/components/Typographie'
import { CalendarInterview, UpdateInterviewScheduling } from '@/services/interview-evaluation/useInterviewEvaluationApi'
import { formatDateTimeLocal, dateTimeLocalToISO } from '@/common/utils/dateTimeUtils'

interface EditInterviewModalProps {
  isOpen: boolean
  onClose: () => void
  interview: CalendarInterview | null
  onSave: (evaluationId: string, interviewType: 'rh' | 'technique' | 'manager', data: UpdateInterviewScheduling) => void
  isLoading?: boolean
}

const EditInterviewModal: React.FC<EditInterviewModalProps> = ({
  isOpen,
  onClose,
  interview,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateInterviewScheduling>({
    dateEntretien: '',
    dureeMinutes: 60,
    lieu: '',
    meetLink: '',
    interviewerEmail: '',
    notesEntretien: '',
  })

  useEffect(() => {
    if (interview) {
      // Convert ISO date to datetime-local format (preserving local time)
      const dateValue = interview.dateEntretien
        ? formatDateTimeLocal(interview.dateEntretien)
        : ''

      setFormData({
        dateEntretien: dateValue,
        dureeMinutes: interview.dureeMinutes || 60,
        lieu: interview.lieu || '',
        meetLink: interview.meetLink || '',
        interviewerEmail: interview.interviewerEmail || '',
        notesEntretien: interview.notesEntretien || '',
      })
    }
  }, [interview])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!interview) return

    // Convert datetime-local to ISO string (preserving local time)
    const dataToSend = {
      ...formData,
      dateEntretien: formData.dateEntretien ? dateTimeLocalToISO(formData.dateEntretien) : undefined,
    }

    onSave(interview.id, interview.interviewType, dataToSend)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="outside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <Typography variant="h3">
              Modifier l'entretien - {interview?.candidatureName}
            </Typography>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date et heure de l'entretien *
                </label>
                <Input
                  type="datetime-local"
                  value={
                    formData.dateEntretien
                      ? new Date(formData.dateEntretien).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dateEntretien: new Date(e.target.value).toISOString(), // stocker en ISO
                    })
                  }
                  required
                  fullWidth
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Durée (minutes) *
                </label>
                <Input
                  type="number"
                  value={formData.dureeMinutes?.toString() || '60'}
                  onChange={(e) => setFormData({ ...formData, dureeMinutes: parseInt(e.target.value) || 60 })}
                  min={15}
                  max={480}
                  required
                  fullWidth
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lieu de l'entretien
                </label>
                <Input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  placeholder="Ex: Bureau 304, Siège social"
                  fullWidth
                />
              </div>

              {/* Meet Link */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lien de visioconférence
                </label>
                <Input
                  type="url"
                  value={formData.meetLink}
                  onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  fullWidth
                />
              </div>

              {/* Interviewer Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email de l'intervieweur
                </label>
                <Input
                  type="email"
                  value={formData.interviewerEmail}
                  onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                  placeholder="interviewer@company.com"
                  fullWidth
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes sur l'entretien
                </label>
                <Textarea
                  value={formData.notesEntretien}
                  onChange={(e) => setFormData({ ...formData, notesEntretien: e.target.value })}
                  placeholder="Informations complémentaires..."
                  minRows={3}
                  fullWidth
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="solid"
              color="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isLoading={isLoading}
            >
              Enregistrer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditInterviewModal
