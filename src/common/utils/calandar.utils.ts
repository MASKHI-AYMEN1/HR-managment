import { RentType, TransformedRentType } from '../types/Rent'

export const transformRentArray = (
  rents: RentType[] | undefined
): TransformedRentType[] => {
  if (rents) {
    return rents?.map((rent) => ({
      start: rent.startDate,
      end: rent.endDate,
      title: rent?.vehicle?.name,
      color:
        rent.confirmed === null
          ? '#BABABA'
          : rent.confirmed
            ? '#1ca1ef'
            : '#F31260',
      ...rent,
    }))
  }

  return []
}
