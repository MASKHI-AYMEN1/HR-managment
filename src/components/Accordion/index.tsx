import React, { ReactNode } from 'react'
import { Accordion, AccordionItem } from '@heroui/react'

export interface AccordionItemData {
  key: string
  title: ReactNode
  content: ReactNode
  startContent?: ReactNode
  subtitle?: string
  classNames?: {
    base?: string
    title?: string
    content?: string
  }
}

interface CustomAccordionProps {
  items: AccordionItemData[]
  variant?: 'light' | 'shadow' | 'bordered' | 'splitted'
  selectionMode?: 'single' | 'multiple'
  defaultExpandedKeys?: string[]
  className?: string
  isCompact?: boolean
  isDisabled?: boolean
  showDivider?: boolean
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  items,
  variant = 'bordered',
  selectionMode = 'single',
  defaultExpandedKeys,
  className = '',
  isCompact = false,
  isDisabled = false,
  showDivider = true,
}) => {
  return (
    <Accordion
      variant={variant}
      selectionMode={selectionMode}
      defaultExpandedKeys={defaultExpandedKeys}
      className={className}
      isCompact={isCompact}
      isDisabled={isDisabled}
      showDivider={showDivider}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.key}
          title={item.title}
          subtitle={item.subtitle}
          startContent={item.startContent}
          classNames={item.classNames}
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default CustomAccordion
