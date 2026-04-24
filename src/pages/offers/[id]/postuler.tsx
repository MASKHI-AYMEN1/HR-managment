import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import PublicLayout from '@/layouts/PublicLayout'
import useOffersApi from '@/services/offers/useOffersApi'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import useUsersApi from '@/services/users/useUsersApi'
import PageTitle from '@/components/PageTitle'
import Typography from '@/components/Typographie'
import TextInput from '@/components/TextInput'
import CustomFileInput from '@/components/CustomFileInput'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import useToast from '@/common/hooks/useToast'
import { Checkbox, Modal, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@heroui/react'

type ApplicationForm = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateNaissance?: string
  cv?: File | null
  coverLetter?: File | null
}

export default function PostulerPage() {
  const intl = useIntl()
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const { useGetOffer } = useOffersApi()
  const { data: offer, isLoading: offerLoading } = useGetOffer(id as string)
  const { useCreateCandidature } = useCandidatureApi()
  const { mutateAsync: createCandidature } = useCreateCandidature()
  const { useGetMe } = useUsersApi()
  const { data: me } = useGetMe()
  const [isOpen, setIsOpen] = useState(false)
  const onOpenChange = (open: boolean) => setIsOpen(open)
  const [isChecked, setIsChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplicationForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateNaissance: '',
      cv: null,
      coverLetter: null,
    },
  })

  // Pre-fill form with logged-in user's info
  useEffect(() => {
    if (me) {
      const fn = me.firstName || me.first_name || ''
      const ln = me.lastName || me.last_name || ''
      const em = me.email || ''
      if (fn) setValue('firstName', fn)
      if (ln) setValue('lastName', ln)
      if (em) setValue('email', em)
    }
  }, [me, setValue])

  const onSubmit = async (values: ApplicationForm) => {
    setSuccessMsg('')
    setErrorMsg('')
    setSubmitting(true)
    try {
      // Single FormData request: candidature + files handled together by backend
      await createCandidature({
        offerId: id as string,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        dateNaissance: values.dateNaissance || undefined,
        userId: me?.id || undefined,
        cv: values.cv ?? null,
        coverLetter: values.coverLetter ?? null,
      })

      toast.showToast({
        type: 'success',
        message: 'Candidature soumise avec succès!',
        data: {
          description: 'Votre candidature a été soumise avec succès.'
        }
      })

      setSuccessMsg(
        intl.formatMessage({
          id: 'candidature.success',
          defaultMessage: 'Your application has been submitted successfully!',
        })
      )
      reset()
    } catch {
      toast.showToast({
        type: 'error',
        message: 'Erreur lors de la soumission de la candidature',
        data: { description: 'Impossible de soumettre la candidature' }
      })
      setErrorMsg(
        intl.formatMessage({
          id: 'candidature.error',
          defaultMessage: 'An error occurred. Please try again.',
        })
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (offerLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-2 flex gap-4">
            <Button onClick={() => router.push(`/offers/${id}`)} color="secondary">
            ← {intl.formatMessage({ id: 'button.back', defaultMessage: 'Back' })}
          </Button>
          <PageTitle
            title={intl.formatMessage({ id: 'candidature.applyTitle', defaultMessage: 'Application form' })}
          />
        </div>
        {offer?.title && (
          <Typography className="text-gray-500 mb-8 text-sm">
            {intl.formatMessage({ id: 'offer.apply', defaultMessage: 'Apply for this offer' })} :{' '}
            <span className="font-semibold text-gray-800 dark:text-white">{offer.title}</span>
          </Typography>
        )}

        {/* Success / Error banners */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* First Name */}
          <TextInput
            name="firstName"
            control={control}
            label={intl.formatMessage({ id: 'candidature.firstName', defaultMessage: 'First name' })}
            placeholder={intl.formatMessage({ id: 'candidature.firstName', defaultMessage: 'First name' })}
            isInvalid={!!errors.firstName}
            errorMessage={errors.firstName?.message}
          />

          {/* Last Name */}
          <TextInput
            name="lastName"
            control={control}
            label={intl.formatMessage({ id: 'candidature.lastName', defaultMessage: 'Last name' })}
            placeholder={intl.formatMessage({ id: 'candidature.lastName', defaultMessage: 'Last name' })}
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName?.message}
          />

          {/* Email */}
          <TextInput
            name="email"
            control={control}
            label={intl.formatMessage({ id: 'candidature.email', defaultMessage: 'Email' })}
            placeholder="example@email.com"
            type="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          {/* Phone */}
          <TextInput
            name="phone"
            control={control}
            label={intl.formatMessage({ id: 'candidature.phone', defaultMessage: 'Phone' })}
            placeholder="+216 XX XXX XXX"
            type="tel"
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />

          {/* Date de naissance */}
          <TextInput
            name="dateNaissance"
            control={control}
            label={intl.formatMessage({ id: 'candidature.dateNaissance', defaultMessage: 'Date de naissance' })}
            placeholder="YYYY-MM-DD"
            type="date"
            isInvalid={!!errors.dateNaissance}
            errorMessage={errors.dateNaissance?.message}
          />

          {/* CV */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {intl.formatMessage({ id: 'candidature.cv', defaultMessage: 'CV' })}
            </p>
            <CustomFileInput
              name="cv"
              control={control}
              type="FILE"
              isInvalid={!!errors.cv}
              errorMessage={(errors.cv as any)?.message}
              resetFileField={() => setValue('cv', null)}
            />
          </div>

          {/* Cover Letter */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {intl.formatMessage({ id: 'candidature.coverLetter', defaultMessage: 'Cover letter' })}
            </p>
            <CustomFileInput
              name="coverLetter"
              control={control}
              type="FILE"
              isInvalid={!!errors.coverLetter}
              errorMessage={(errors.coverLetter as any)?.message}
              resetFileField={() => setValue('coverLetter', null)}
            />
          </div>
          <div>
                           <div className="flex gap-2 mb-4">
            <Button color="primary" size="sm" onClick={() => setIsOpen(true)}>
              {intl.formatMessage({ id: 'candidature.termsLink', defaultMessage: 'Terms and Conditions' })}
            </Button>
              <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
                {intl.formatMessage({ id: 'candidature.terms', defaultMessage: 'I agree to the terms and conditions' })}
              </Checkbox>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                <ModalHeader>
                  <Typography className="text-lg font-semibold">
                    {intl.formatMessage({ id: 'candidature.termsHeader', defaultMessage: 'Terms and Conditions' })}
                  </Typography>
                </ModalHeader>
                <ModalBody>
                  {/* Terms and conditions content goes here */}
                  <Typography className="mb-4">
                    {intl.formatMessage({ id: 'candidature.termsContent', defaultMessage: 'Terms and conditions content goes here...' })}
                  </Typography>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" size="sm" onClick={() => setIsOpen(false)}>
                    {intl.formatMessage({ id: 'candidature.close', defaultMessage: 'Close' })}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
         
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              color="warning"
              className="w-full text-base py-3"
              isLoading={submitting}
              disabled={submitting || successMsg.length > 0 || !isChecked}
            >
              {intl.formatMessage({ id: 'button.submit', defaultMessage: 'Submit my application' })}
            </Button>
          </div>
        </form>
      </div>
    </PublicLayout>
  )
}
