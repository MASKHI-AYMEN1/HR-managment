'use client'

import '@/styles/globals.css'
import 'react-phone-number-input/style.css'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../../node_modules/flag-icons/css/flag-icons.min.css'
import type { AppProps } from 'next/app'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from 'sonner'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import useCookiesBlocked from '@/common/hooks/useCookiesBlocked'
import { IntlProvider } from 'react-intl'
import locales from '@/assets/locales'
import usePreferenceSlice from '@/store/Preference/usePreferenceSlice'

type NextPageWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

export default function App({ Component, pageProps }: NextPageWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  const component = getLayout(<Component {...pageProps} />)
  const cookiesBlocked = useCookiesBlocked()

  const { language } = usePreferenceSlice()
  const [messages, setMessages] = useState<any>(null)

  useEffect(() => {
    setMessages(locales[language] || locales['fr'])
  }, [language])

  function getDirection(locale: string) {
    switch (locale) {
      case 'fr':
        return 'fr'
      case 'ar':
        return 'ar'
      default:
        return 'en'
    }
  }

  return (
    <HeroUIProvider locale="fr-FR">
      <IntlProvider locale={language} messages={messages} onError={() => null}>
        <NextThemesProvider attribute="data-theme" defaultTheme="dark">
          <div dir={getDirection(language)}>
            <ReactQueryProvider>
              {cookiesBlocked ? (
                <p>Les cookies sont bloqués par votre navigateur.</p>
              ) : (
                <>{component} </>
              )}

              <Toaster richColors visibleToasts={2} />
            </ReactQueryProvider>
          </div>
        </NextThemesProvider>
      </IntlProvider>
    </HeroUIProvider>
  )
}
