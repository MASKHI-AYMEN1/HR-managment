import { useShallow } from 'zustand/react/shallow'
import usePreferenceStore from './usePreferenceStore'

const usePreferenceSlice = () => {
  const defaultDashboardId = usePreferenceStore(
    (state) => state.defaultDashboardId
  )
  const language = usePreferenceStore((state) => state.language)
  const screenMode = usePreferenceStore((state) => state.screenMode)
  const setDefaultDashboardId = usePreferenceStore(
    useShallow((state) => state.setDefaultDashboardId)
  )
  const setLanguage = usePreferenceStore(
    useShallow((state) => state.setLanguage)
  )
  const setScreenMode = usePreferenceStore(
    useShallow((state) => state.setScreenMode)
  )
  const ToggleScreenMode = usePreferenceStore(
    useShallow((state) => state.toggleScreenMode)
  )

  return {
    defaultDashboardId,
    setDefaultDashboardId,
    screenMode,
    setLanguage,
    setScreenMode,
    ToggleScreenMode,
    language,
  }
}

export default usePreferenceSlice
