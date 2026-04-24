import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PublicLayout from '@/layouts/PublicLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import useUsersApi from '@/services/users/useUsersApi'
import { useIntl } from 'react-intl'
import ApiClient from '@/common/configuration/http'
import useToast from '@/common/hooks/useToast'

export default function ProfilePage() {
  const intl = useIntl()
  const router = useRouter()
  const { showToast } = useToast()
  const { useGetMe, useUpdateMe } = useUsersApi()
  const { data: me, isLoading } = useGetMe()
  const updateMe = useUpdateMe()

  const emptyForm = { firstName: '', lastName: '', email: '', login: '', photo: '' }
  const [form, setForm] = useState(emptyForm)
  const [initialForm, setInitialForm] = useState(emptyForm)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    if (me) {
      const loaded = {
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        login: me.login || '',
        photo: me.photo || '',
      }
      setForm(loaded)
      setInitialForm(loaded)
    }
  }, [me])

  const isDirty =
    form.firstName !== initialForm.firstName ||
    form.lastName  !== initialForm.lastName  ||
    form.email     !== initialForm.email     ||
    form.login     !== initialForm.login     ||
    form.photo     !== initialForm.photo

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await ApiClient.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const fileUrl: string = res.data?.fileUrl || ''
      setForm((prev) => ({ ...prev, photo: fileUrl }))
    } catch {
      showToast({ type: 'error', message: 'Erreur lors du téléchargement de la photo.' })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = () => {
    updateMe.mutate(
      { firstName: form.firstName, lastName: form.lastName, email: form.email, login: form.login, photo: form.photo },
      {
        onSuccess: () => {
          setInitialForm({ ...form })
          showToast({ type: 'success', message: intl.formatMessage({ id: 'profile.updated', defaultMessage: 'Profil mis à jour' }) })
        },
        onError: () => showToast({ type: 'error', message: intl.formatMessage({ id: 'profile.updateError', defaultMessage: 'Erreur lors de la mise à jour' }) }),
      }
    )
  }

  const backendBase = process.env.NEXT_PUBLIC_BASE_URL || ''
  const photoSrc = form.photo
    ? form.photo.startsWith('http') ? form.photo : `${backendBase}${form.photo}`
    : null

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <PageTitle title={intl.formatMessage({ id: 'profile', defaultMessage: 'Profil' })} />
          <Button color="warning" onClick={() => router.push('/candidatures')}>
            {intl.formatMessage({ id: 'profile.myCandidatures', defaultMessage: 'Mes candidatures' })}
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {isLoading ? (
            <p className="text-gray-500">{intl.formatMessage({ id: 'loading', defaultMessage: 'Chargement...' })}</p>
          ) : (
            <>
              {/* Photo */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  {photoSrc ? (
                    <img src={photoSrc} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-gray-400">
                      {form.firstName?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {me?.firstName} {me?.lastName}
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
                    {uploadingPhoto
                      ? intl.formatMessage({ id: 'loading', defaultMessage: 'Chargement...' })
                      : intl.formatMessage({ id: 'profile.changePhoto', defaultMessage: 'Changer la photo' })}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'firstName', placeholder: 'Prénom' },
                  { key: 'lastName', placeholder: 'Nom' },
                  { key: 'email', placeholder: 'Email' },
                  { key: 'login', placeholder: 'Login' },
                ].map(({ key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{placeholder}</label>
                    <input
                      value={(form as any)[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button color="warning" onClick={handleSave} isLoading={updateMe.isPending} isDisabled={!isDirty || updateMe.isPending}>
                  {intl.formatMessage({ id: 'button.save', defaultMessage: 'Enregistrer' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
