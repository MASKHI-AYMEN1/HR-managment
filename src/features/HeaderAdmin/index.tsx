import DropdownUserMenu from '@/components/DropdownUserMenu'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggler from '@/components/ThemeToggler'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import React from 'react'
import { useIntl } from 'react-intl'

export default function Index() {
  const intl = useIntl()
  const { useGetCurrentUser } = useAuthenticationAPI()
  const { data: userData } = useGetCurrentUser()

  return (
    <div className="mb-18 flex justify-between">
              <div className=" flex justify-start items-center space-x-10 text-yellow-700">
        <span className='uppercase text-3xl font-bold text-yellow-700'>
          {intl.formatMessage({ id: 'header.admin.title' })}
        </span>

      </div>
      <div className="flex items-center justify-end space-x-4">
        <div className="flex items-center gap-6 xl:mt-0 ">
          <ThemeToggler />
          <LanguageSwitcher />
        </div>
        <DropdownUserMenu user={userData} />
      </div>
    </div>
  )
}
