import { sidebarCollapse } from '../type'
import { tv } from '@heroui/react'

export const changeAndReleaseCollapseItem: sidebarCollapse[] = [
  { title: 'Change Registry', path: '/change-release/registry' },
  {
    title: 'Raise New Change',
    path: '/change-release/change-registry/proposal/new',
  },
  { title: 'Lookup Tables', path: '/lookup-tables' },
]

export const SidebarWrapper = tv({
  base: 'bg-background transition-transform h-full fixed -translate-x-full w-80 shrink-0 z-[202] overflow-y-auto border-r border-divider flex-col py-6 px-3 lg:ml-0 lg:flex lg:static lg:h-screen lg:translate-x-0 dark:bg-gray-800',

  variants: {
    collapsed: {
      true: 'translate-x-0 ml-0 [display:inherit]',
    },
  },
})

export const Overlay = tv({
  base: 'bg-[rgb(15_23_42/0.3)] fixed inset-0 z-[201] opacity-80 transition-opacity lg:hidden lg:z-auto lg:opacity-100',
})

export const Header = tv({
  base: 'flex gap-8 items-center px-6',
})

export const Body = tv({
  base: 'flex flex-col gap-1 mt-9 px-2',
})

export const Footer = tv({
  base: 'flex items-center justify-center gap-6 pt-16 pb-8 px-8 lg:pt-10 lg:pb-0',
})

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
})
