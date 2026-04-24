'use client'
import React from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { Accordion, AccordionItem } from '@heroui/react'
import { FilterCollapse } from './type'
import { CheckboxGroup, Checkbox } from '@heroui/react'

interface Props {
  icon: React.ReactNode
  title: string
  items: FilterCollapse[]
}

export const FilterCollapseItems = ({ icon, items, title }: Props) => {
  const [selected, setSelected] = React.useState<Array<string>>([])
  const handleChange = (e: string[]) => {
    const lastElement = e[e.length - 1]
    setSelected([lastElement])
  }

  return (
    <div className="flex gap-4 h-full w-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<FaAngleDown />}
          classNames={{
            indicator: 'data-[open=true]:-rotate-180',
            trigger:
              'py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5',

            title:
              'px-0 flex text-base gap-2 h-full items-center cursor-pointer',
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2 items-center text-lg">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <CheckboxGroup
            color="primary"
            value={selected}
            onValueChange={handleChange}
            className="p-2"
          >
            {items.map((item) => (
              <Checkbox
                key={item.title}
                className="w-full flex text-white hover:text-default-900 transition-colors"
                radius="full"
                value={item.title}
              >
                {item.title}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
