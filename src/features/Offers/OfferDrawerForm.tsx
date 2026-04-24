import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useOffersApi, { OfferPayload } from '@/services/offers/useOffersApi'
import TextInput from '@/components/TextInput'
import WysiwygEditor from '@/components/WysiwygEditor'
import DatePickerInput from '@/components/DatePickerInput'
import { today, getLocalTimeZone } from '@internationalized/date'
import { useIntl } from 'react-intl'
import useToast from '@/common/hooks/useToast'
import { Checkbox } from '@heroui/react'

export interface OfferDrawerFormProps {
  mode: 'create' | 'edit'
  offerId?: string
  onSuccess?: () => void
  formId: string
}

const OfferDrawerForm: React.FC<OfferDrawerFormProps> = ({ mode, offerId, onSuccess, formId }) => {
  const intl = useIntl()
  const { showToast } = useToast()
  const { useGetOffer, useCreateOffer, useUpdateOffer } = useOffersApi()
  const { data: offer, isLoading: loadingOffer } =
    mode === 'edit' && offerId ? useGetOffer(offerId) : { data: null, isLoading: false }
  const createMutation = useCreateOffer()
  const updateMutation = useUpdateOffer(offerId)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const contractTypes = [
    { value: 'CDI', label: intl.formatMessage({ id: 'offer.typeContrat.CDI', defaultMessage: 'CDI' }) },
    { value: 'CDD', label: intl.formatMessage({ id: 'offer.typeContrat.CDD', defaultMessage: 'CDD' }) },
    { value: 'CIVP', label: intl.formatMessage({ id: 'offer.typeContrat.CIVP', defaultMessage: 'CIVP' }) },
  ]

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OfferPayload>({
    defaultValues: {
      title: '',
      dateDeadline: '',
      description: '',
      salary: undefined,
      niveau: '',
      experienceDomain: '',
      typeContrat: [],
      image: '',
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setValue('image', base64)
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setValue('image', '')
    setImagePreview(null)
  }

  useEffect(() => {
    if (mode === 'edit' && offer) {
      reset({
        title: offer.title,
        dateDeadline: offer.dateDeadline || '',
        description: offer.description || '',
        salary: offer.salary,
        niveau: offer.niveau || '',
        experienceDomain: offer.experienceDomain || '',
        typeContrat: Array.isArray(offer.typeContrat)
          ? offer.typeContrat
          : offer.typeContrat
            ? [offer.typeContrat]
            : [],
        image: offer.image || '',
      })
      if (offer.image) {
        setImagePreview(offer.image)
      }
    }
  }, [mode, offer, reset])

  const onSubmit = (values: OfferPayload) => {
    const mutation = mode === 'create' ? createMutation : updateMutation
    mutation.mutate(values, {
      onSuccess: () => {
        showToast({
          type: 'success',
          message: intl.formatMessage({ id: `offer.${mode === 'create' ? 'created' : 'updated'}`, defaultMessage: mode === 'create' ? 'Offer created' : 'Offer updated' }),
        })
        if (onSuccess) onSuccess()
      },
      onError: () => {
        showToast({
          type: 'error',
          message: intl.formatMessage({ id: `offer.${mode === 'create' ? 'createError' : 'updateError'}`, defaultMessage: mode === 'create' ? 'Failed to create offer' : 'Failed to update offer' }),
        })
      },
    })
  }

  if (mode === 'edit' && loadingOffer) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <TextInput
          label={intl.formatMessage({ id: 'offer.title', defaultMessage: 'Title' })}
          name="title"
          placeholder=""
          control={control}
          errorMessage={errors.title?.message || ''}
          isInvalid={!!errors.title}
        />

        <TextInput
          label={intl.formatMessage({ id: 'offer.salary', defaultMessage: 'Salary' })}
          name="salary"
          placeholder=""
          control={control}
          errorMessage={errors.salary?.message || ''}
          isInvalid={!!errors.salary}
        />
        <TextInput
          label={intl.formatMessage({ id: 'offer.niveau', defaultMessage: 'Niveau' })}
          name="niveau"
          placeholder=""
          control={control}
          errorMessage={errors.niveau?.message || ''}
          isInvalid={!!errors.niveau}
        />
        <DatePickerInput
          label={intl.formatMessage({ id: 'offer.dateDeadline', defaultMessage: 'Deadline' })}
          name="dateDeadline"
          control={control}
          errorMessage={errors.dateDeadline?.message || ''}
          isInvalid={!!errors.dateDeadline}
          defaultDate={today(getLocalTimeZone())}
        />
        <div className="md:col-span-2">
          <TextInput
            label={intl.formatMessage({ id: 'offer.experienceDomain', defaultMessage: 'Experience domain' })}
            name="experienceDomain"
            placeholder=""
            control={control}
            errorMessage={errors.experienceDomain?.message || ''}
            isInvalid={!!errors.experienceDomain}
          />
        </div>
      </div>
      <div className="md:col-span-2 mt-4 mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          {intl.formatMessage({ id: 'offer.typeContrat', defaultMessage: 'Type contrat' })}
        </label>
        <Controller
          name="typeContrat"
          control={control}
          render={({ field: { value, onChange } }) => {
            const selected = Array.isArray(value) ? value : []
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contractTypes.map((contract) => (
                  <Checkbox
                    key={contract.value}
                    isSelected={selected.includes(contract.value)}
                    onValueChange={(checked) => {
                      if (checked) {
                        onChange([...selected, contract.value])
                      } else {
                        onChange(selected.filter((item) => item !== contract.value))
                      }
                    }}
                  >
                    {contract.label}
                  </Checkbox>
                ))}
              </div>
            )
          }}
        />
      </div>
      <WysiwygEditor
        label={intl.formatMessage({ id: 'offer.description', defaultMessage: 'Description' })}
        name="description"
        control={control}
        errorMessage={errors.description?.message || ''}
        isInvalid={!!errors.description}
      />
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          {intl.formatMessage({ id: 'offer.image', defaultMessage: 'Image de l\'offre' })}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 focus:outline-none"
        />
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-w-md h-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </form>
  )
}

export default OfferDrawerForm
