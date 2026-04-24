import NextLink from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { useSidebarContext } from '@/common/hooks/useSideBarContext'

interface Props {
  title: string
  icon: React.ReactNode
  isActive?: boolean
  href?: string
}

export const SidebarItem = ({ icon, title, isActive, href = '' }: Props) => {
  const { setCollapsed } = useSidebarContext()

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed()
    }
  }

  return (
    <NextLink
      href={href}
      className="text-default-900 active:bg-none max-w-full"
    >
      <button
        className={clsx(
          isActive
            ? 'bg-primary-100 [&_svg_path]:fill-primary-500'
            : 'hover:bg-default-100',
          'flex gap-3 justify-start w-full min-h-[44px] h-full items-center px-3.5 rounded-xl text-lg cursor-pointer transition-all duration-150 active:scale-[0.98]'
        )}
        onClick={handleClick}
      >
        <span className="text-default-900 flex items-start text-start">
          {icon}
        </span>
        <span className="text-default-900 flex items-start text-start">
          {title}
        </span>
      </button>
    </NextLink>
  )
}
