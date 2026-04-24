export type OfferStatus = 'ouverte' | 'en_evaluation' | 'cloturee'

export type Offer = {
  id: string
  title: string
  dateCreation?: string
  dateDeadline?: string
  description?: string
  salary?: number
  niveau?: string
  experienceDomain?: string
  typeContrat?: string[]
  image?: string
  status?: OfferStatus
  isClosed?: boolean
}
