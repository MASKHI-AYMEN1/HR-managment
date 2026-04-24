import React from 'react'
import { Tabs, Tab } from '@heroui/react'
import { CustomTabsProps } from './types'

const CustomTabs = ({
  tabs,
  initialSelectedKey,
  color = 'primary',
  variant = 'underlined',
  className = 'bg-white border-2 border-gray-200 rounded-xl p-5 dark:bg-black/40 dark:text-white dark:border-gray-700',
}: CustomTabsProps & { className?: string }) => {
  const [selected, setSelected] = React.useState(initialSelectedKey)

  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        color={color}
        variant={variant}
        onSelectionChange={(key) => setSelected(String(key))}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            className={`${variant == 'solid' && selected == tab.key ? 'text-white dark:text-blue-300' : 'dark:text-white/60'}`}
            title={
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span className="text-medium font-normal">{tab.title}</span>
              </div>
            }
          >
            <div className={className}>{tab.content}</div>
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}
export default CustomTabs
