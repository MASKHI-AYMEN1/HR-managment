import { FiBriefcase, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import Typography from '@/components/Typographie'
import { DarkModeSwitch } from '@/components/Darkmodeswitch'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { LOGO_ICON } from '@/assets/images'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import { useRouter } from 'next/router'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const intl = useIntl()
  const router = useRouter()
  const { useGetCurrentUser, useLogOut } = useAuthenticationAPI()
  const { data: currentUser } = useGetCurrentUser()
  const { mutate: logout } = useLogOut()

  const navLinks = [
    { href: '/offers',             label: intl.formatMessage({ id: 'nav.jobs' }) },
    { href: '/conseils-carriere',  label: intl.formatMessage({ id: 'nav.careerAdvice', defaultMessage: 'Conseils carrière' }) },
    { href: '/contact',            label: intl.formatMessage({ id: 'nav.contact' }) },
  ]

  const handleLogout = () => {
    logout('', {
      onSuccess: () => {
        setIsUserMenuOpen(false)
        router.push('/')
      },
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src={LOGO_ICON} alt="Logo" height="18" width="60" />
            <Typography variant="h5" weight="bold" className="text-gray-900 dark:text-white">
              RH
            </Typography>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3 relative">
            <DarkModeSwitch />
            <LanguageSwitcher />
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg text-sm"
                >
                  {currentUser.firstName || 'User'}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {intl.formatMessage({ id: 'profile', defaultMessage: 'Profile' })}
                    </Link>
                    <Link
                      href="/candidatures"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {intl.formatMessage({ id: 'candidature.listTitle', defaultMessage: 'Candidatures' })}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                    >
                      {intl.formatMessage({ id: 'logout', defaultMessage: 'Logout' })}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-lg text-sm"
              >
                {intl.formatMessage({ id: 'nav.login' })}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100 dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition-colors font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <DarkModeSwitch />
              <LanguageSwitcher />
            </div>
            {currentUser ? (
              <div className="space-y-2 pt-2">
                <Link
                  href="/profile"
                  className="block w-full text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {intl.formatMessage({ id: 'profile', defaultMessage: 'Profile' })}
                </Link>
                <Link
                  href="/customer/history"
                  className="block w-full text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {intl.formatMessage({ id: 'candidature.listTitle', defaultMessage: 'Candidatures' })}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  {intl.formatMessage({ id: 'logout', defaultMessage: 'Logout' })}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                {intl.formatMessage({ id: 'nav.login' })}
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}