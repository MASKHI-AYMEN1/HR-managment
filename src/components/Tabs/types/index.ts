import { TabsProps } from '@heroui/react'

export type TabItem = {
  key: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export type CustomTabsProps = {
  color?: TabsProps['color']
  variant?: TabsProps['variant']
  tabs: TabItem[]
  initialSelectedKey: string
}
