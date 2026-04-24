import { useTheme } from 'next-themes'
import Image from 'next/image'
import { FC } from 'react'

interface ThemeTogglerProps {
  width?: number
}
const ThemeToggler:FC<ThemeTogglerProps> = ({width}) => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-gray-100 dark:bg-gray-900 right-17 mr-1.5 flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
    >
      <Image
        src="/images/icon/icon-moon.svg"
        alt="moon icon"
        width={width? width:32}
        height={width? width:32}
        className={theme === 'dark' ? 'hidden' : 'block'}
      />
      <Image
        src="/images/icon/icon-sun.svg"
        alt="sun icon"
        width={width? width:32}
        height={width? width:32}
        className={theme === 'dark' ? 'block' : 'hidden'}
      />
    </button>
  )
}

export default ThemeToggler
