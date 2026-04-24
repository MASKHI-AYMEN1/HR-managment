import React, { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
  Textarea,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';
import TextInput from '@/components/TextInput';
import CustomSelect from '@/components/CustomSelect';
import useOffersApi from '@/services/offers/useOffersApi';
import useCandidatureApi from '@/services/candidature/useCandidatureApi';
import useInterviewSchedulingApi, { ScheduleInterviewPayload } from '@/services/interviews/useInterviewSchedulingApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultOfferId?: string;
  defaultCandidatureId?: string;
}

interface FormValues {
  offerId: string;
  candidatureId: string;
  date: string;
  time: string;
  durationMinutes: string;
  location: string;
  interviewerEmail: string;
  notes: string;
  sendConvocation: boolean;
  createGoogleEvent: boolean;
}

const DURATION_ITEMS = [
  { key: '30', label: '30 min' },
  { key: '45', label: '45 min' },
  { key: '60', label: '1h' },
  { key: '90', label: '1h30' },
  { key: '120', label: '2h' },
];

const ScheduleInterviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultOfferId = '',
  defaultCandidatureId = '',
}) => {
  const intl = useIntl();
  const t = (id: string, def: string) => intl.formatMessage({ id, defaultMessage: def });

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      offerId: defaultOfferId,
      candidatureId: defaultCandidatureId,
      date: '',
      time: '10:00',
      durationMinutes: '60',
      location: '',
      interviewerEmail: '',
      notes: '',
      sendConvocation: true,
      createGoogleEvent: true,
    },
  });

  const watchedOfferId = watch('offerId');

  useEffect(() => {
    if (!defaultCandidatureId) setValue('candidatureId', '');
  }, [watchedOfferId, defaultCandidatureId, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        offerId: defaultOfferId,
        candidatureId: defaultCandidatureId,
        date: '',
        time: '10:00',
        durationMinutes: '60',
        location: '',
        interviewerEmail: '',
        notes: '',
        sendConvocation: true,
        createGoogleEvent: true,
      });
    }
  }, [isOpen, defaultOfferId, defaultCandidatureId, reset]);

  // Load offers (all open + en_evaluation)
  const { useListOffersByStatus } = useOffersApi();
  const { data: offersData } = useListOffersByStatus('en_evaluation', 1, 200);
  const offerItems = (offersData?.data ?? []).map((o: any) => ({ key: o.id, label: o.title }));

  // Load candidates (status accepter) for the selected offer
  const { useListCandidaturesByOffer } = useCandidatureApi();
  const { data: candidatesData } = useListCandidaturesByOffer({
    offerId: watchedOfferId,
    status: 'accepter',
    pageSize: 200,
  });
  const candidateItems = (candidatesData?.data ?? []).map((c: any) => ({
    key: c.id,
    label: `${c.first_name} ${c.last_name}`,
  }));

  const { useScheduleInterview } = useInterviewSchedulingApi();
  const { mutate: scheduleInterview, isPending } = useScheduleInterview();

  const onSubmit = (values: FormValues) => {
    if (!values.offerId || !values.candidatureId || !values.date) return;

    const scheduled_at = `${values.date}T${values.time || '09:00'}:00`;

    const payload: ScheduleInterviewPayload = {
      candidature_id: values.candidatureId,
      offer_id: values.offerId,
      scheduled_at,
      duration_minutes: parseInt(values.durationMinutes || '60'),
      location: values.location || undefined,
      interviewer_email: values.interviewerEmail || undefined,
      notes: values.notes || undefined,
      send_convocation: values.sendConvocation,
      create_google_event: values.createGoogleEvent,
    };

    scheduleInterview(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        backdrop: 'bg-gradient-to-t from-black/50 from-50% via-white/30 to-yellow-300/20 backdrop-opacity-100',
      }}
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex gap-2 items-center text-lg font-bold dark:text-white">
              📅 {t('interview.schedule.title', 'Planifier un entretien')}
            </ModalHeader>

            <ModalBody className="space-y-4">
              {/* Offer + Candidate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    name="offerId"
                    control={control}
                    label={t('interview.schedule.offer', 'Offre')}
                    placeholder={t('interview.schedule.selectOffer', 'Sélectionner une offre')}
                    items={offerItems}
                  />
                </div>
                <div>
                  <CustomSelect
                    name="candidatureId"
                    control={control}
                    label={t('interview.schedule.candidate', 'Candidat')}
                    placeholder={t('interview.schedule.selectCandidate', 'Sélectionner un candidat')}
                    items={candidateItems}
                  />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <TextInput
                    name="date"
                    control={control}
                    label={t('interview.schedule.date', 'Date')}
                    placeholder="2026-04-01"
                    type="date"
                  />
                </div>
                <div>
                  <TextInput
                    name="time"
                    control={control}
                    label={t('interview.schedule.time', 'Heure')}
                    placeholder="10:00"
                    type="time"
                  />
                </div>
              </div>

              {/* Duration + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    name="durationMinutes"
                    control={control}
                    label={t('interview.schedule.duration', 'Durée')}
                    placeholder="Durée"
                    items={DURATION_ITEMS}
                  />
                </div>
                <div>
                  <TextInput
                    name="location"
                    control={control}
                    label={t('interview.schedule.location', 'Lieu (laisser vide pour en ligne)')}
                    placeholder="Salle A / En ligne"
                  />
                </div>
              </div>

              {/* Interviewer email */}
              <TextInput
                name="interviewerEmail"
                control={control}
                label={t('interview.schedule.interviewerEmail', 'Email du recruteur')}
                placeholder="recruteur@company.com"
                type="email"
              />

              {/* Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label={t('interview.schedule.notes', 'Notes / Instructions')}
                    placeholder="Documents à apporter, informations spécifiques…"
                    variant="underlined"
                    minRows={2}
                  />
                )}
              />

              {/* Options */}
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t('interview.schedule.options', 'Options')}
                </p>
                <div className="flex flex-col gap-2">
                  <Controller
                    name="sendConvocation"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        size="sm"
                        color="warning"
                      >
                        <span className="text-sm dark:text-gray-300">
                          {t('interview.schedule.sendEmail', '📧 Envoyer la convocation par email au candidat')}
                        </span>
                      </Switch>
                    )}
                  />
                  <Controller
                    name="createGoogleEvent"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        size="sm"
                        color="warning"
                      >
                        <span className="text-sm dark:text-gray-300">
                          {t('interview.schedule.googleMeet', '📹 Créer un événement Google Calendar avec lien Meet')}
                        </span>
                      </Switch>
                    )}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose} className="dark:text-gray-300">
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button
                type="submit"
                color="warning"
                className="text-white font-semibold"
                isLoading={isPending}
              >
                {t('interview.schedule.confirm', 'Planifier l'entretien')}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScheduleInterviewModal;
