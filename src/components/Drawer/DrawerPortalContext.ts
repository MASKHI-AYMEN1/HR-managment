import { createContext, useContext } from 'react'

export const DrawerPortalContext = createContext<Element | null>(null)

export const useDrawerPortal = () => useContext(DrawerPortalContext)
