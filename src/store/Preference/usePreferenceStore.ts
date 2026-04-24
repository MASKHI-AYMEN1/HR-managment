import { DARK_MODE, LIGHT_MODE } from '@/common/constants/ThemeMode'
import { Language } from '@/common/types/Language'
import { create } from 'zustand'

interface PreferenceStoreState {
  language: Language
  defaultDashboardId: number | null
  screenMode: 'light' | 'dark'
  setLanguage: (language: Language) => void
  setDefaultDashboardId: (dashboardId: number) => void
  setScreenMode: (dashboardName: string) => void
  toggleScreenMode: () => void
}

const usePreferenceStore = create<PreferenceStoreState>((set) => ({
  language: 'fr',
  defaultDashboardId: null,
  screenMode: LIGHT_MODE,
  setLanguage: (language: Language) => set({ language: language }),
  setDefaultDashboardId: (dashboardId: number) =>
    set({ defaultDashboardId: dashboardId }),
  setScreenMode: (screenMode: string) =>
    set({ screenMode: screenMode === LIGHT_MODE ? LIGHT_MODE : DARK_MODE }),
  toggleScreenMode: () =>
    set((state) => ({
      screenMode: state.screenMode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE,
    })),
}))

export default usePreferenceStore
