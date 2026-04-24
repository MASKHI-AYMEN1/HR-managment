'use client'

import { useState } from 'react'
import locales from '@/assets/locales'
import usePreferenceSlice from '@/store/Preference/usePreferenceSlice'
import { Select, SelectItem } from '@heroui/react'

type Language = 'fr' | 'en'

const LanguageList: { label: string; value: Language; flag: string }[] = [
  { label: 'Français', value: 'fr', flag: 'fi fi-fr' },
  { label: 'English', value: 'en', flag: 'fi fi-gb' },
]

const LanguageSwitcher = () => {
  const [locale, setLocale] = useState<Language>('fr')
  const { setLanguage } = usePreferenceSlice()

  const onLocaleChange = (keys: any) => {
    const selectedLocale = Array.from(keys as Set<string>)[0] as Language

    if (selectedLocale && locales[selectedLocale as keyof typeof locales]) {
      setLocale(selectedLocale)
      setLanguage(selectedLocale)
    }
  }

  return (
    <Select
      className="max-w-[130px]"
      aria-label="language switcher"
      items={LanguageList}
      selectedKeys={new Set([locale])}
      onSelectionChange={onLocaleChange}
      startContent={
        <span
          className={`${LanguageList.find((lang) => lang.value === locale)?.flag} w-5 h-5 shrink-0`}
        />
      }
      radius="lg"
      classNames={{
        trigger: [
          'h-9 min-h-9 px-3',
          'border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-800',
          'text-gray-800 dark:text-gray-100',
          'shadow-none',
          'hover:border-yellow-400 dark:hover:border-yellow-500',
          'transition-colors',
        ].join(' '),
        value: 'text-gray-800 dark:text-gray-100 text-sm font-medium',
        selectorIcon: 'text-gray-400 dark:text-gray-400',
        listboxWrapper: [
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'rounded-xl shadow-lg',
        ].join(' '),
        popoverContent: 'bg-white dark:bg-gray-800 border-0 shadow-none p-0 rounded-xl',
      }}
    >
      {(language) => (
        <SelectItem
          key={language.value}
          textValue={language.label}
          aria-label={language.label}
          className="text-gray-800 dark:text-white dark:hover:bg-gray-700 data-[selected=true]:bg-yellow-50 dark:data-[selected=true]:bg-yellow-900/20 data-[selected=true]:text-yellow-600 dark:data-[selected=true]:text-yellow-400"
        >
          <div className="flex gap-2 items-center py-0.5">
            <span className={`${language.flag} w-5 h-5 shrink-0`} />
            <span className="text-sm dark:text-white text-gray-900">{language.label}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

export default LanguageSwitcher
