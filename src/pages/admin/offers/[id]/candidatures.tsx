import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { FiLock } from 'react-icons/fi'
import { MdRateReview } from 'react-icons/md'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import useToast from '@/common/hooks/useToast'
import useOffersApi from '@/services/offers/useOffersApi'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import OfferInfoCard from '@/features/Candidatures/OfferInfoCard'
import CloseOfferModal from '@/features/Candidatures/CloseOfferModal'
import CandidaturesTable from '@/features/Candidatures/CandidaturesTable'

function OfferCandidaturesPage() {
    const intl = useIntl()
    const router = useRouter()
    const { id } = router.query as { id: string }
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const toast = useToast()

    const { useGetOffer, useCloseOffer, useUpdateOfferStatus } = useOffersApi()
    const { useExportCandidatures, useExportCvDetails } = useCandidatureApi()

    const { data: offer, isLoading: offerLoading } = useGetOffer(id)
    const { mutate: closeOffer, isPending: isClosing } = useCloseOffer()
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOfferStatus()
    const { mutate: exportExcel, isPending: isExporting } = useExportCandidatures()
    const { mutate: exportCvDetails, isPending: isExportingCv } = useExportCvDetails()

    if (offerLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader />
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Title + close button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                    <Button onClick={() => router.push('/admin/offers')} color="warning" variant="bordered" className='text-yellow-500'>
                        ← {intl.formatMessage({ id: 'button.back', defaultMessage: 'Retour' })}
                    </Button>
                    <PageTitle
                        title={intl.formatMessage({ id: 'candidature.listTitle', defaultMessage: 'Candidatures' })}
                    />
                </div>

                {offer && !offer.isClosed && (
                    <div className="flex gap-3">
                        {offer.status !== 'en_evaluation' && (
                            <Button
                                color="primary"
                                onClick={() => {
                                    updateStatus(
                                        { id, status: 'en_evaluation' },
                                        {
                                            onSuccess: () => {
                                                toast.showToast({
                                                    type: 'success',
                                                    message: intl.formatMessage({
                                                        id: 'offer.statusUpdated',
                                                        defaultMessage: "Statut de l'offre mis à jour avec succès",
                                                    }),
                                                    data: { description: 'L\'offre est maintenant en évaluation' }
                                                })
                                            },
                                        }
                                    )
                                }}
                                isLoading={isUpdatingStatus}
                                startContent={<MdRateReview size={18} />}
                            >
                                {intl.formatMessage({
                                    id: 'button.setEvaluation',
                                    defaultMessage: 'Mettre en évaluation',
                                })}
                            </Button>
                        )}
                        <Button
                            color="danger"
                            onClick={() => setShowCloseConfirm(true)}
                            startContent={<FiLock size={15} />}
                        >
                            {intl.formatMessage({ id: 'button.closeOffer', defaultMessage: "Clôturer l'offre" })}
                        </Button>
                    </div>
                )}
            </div>

            {/* Close offer confirmation modal */}
            <CloseOfferModal
                isOpen={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                isLoading={isClosing}
                onConfirm={(onClose) => closeOffer(id, { onSuccess: () => onClose() })}
            />

            {/* Offer details card */}
            {offer && <OfferInfoCard offer={offer} />}

            {/* Candidatures table + export */}
            <CandidaturesTable
                offerId={id}
                isExporting={isExporting}
                onExport={() =>
                    exportExcel({
                        offerId: id,
                        fileName: `candidatures_${offer?.title ?? id}.xlsx`,
                    })
                }
                isExportingCv={isExportingCv}
                onExportCv={() =>
                    exportCvDetails({
                        offerId: id,
                        fileName: `cv_details_${offer?.title ?? id}.xlsx`,
                    })
                }
            />
        </div>
    )
}

OfferCandidaturesPage.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
}

export default OfferCandidaturesPage
