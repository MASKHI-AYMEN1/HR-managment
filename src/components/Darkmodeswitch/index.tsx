'use client'
import React from 'react'
import { IoSunnyOutline } from 'react-icons/io5'
import { IoMoonOutline } from 'react-icons/io5'
import { useTheme } from 'next-themes'
import { Dropdown, DropdownTrigger, DropdownItem } from '@heroui/react'
import { Button, DropdownMenu } from '@heroui/react'

export function DarkModeSwitch() {
  const { setTheme } = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700">
          <IoSunnyOutline className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IoMoonOutline className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem onClick={() => setTheme('light')}>Light</DropdownItem>
        <DropdownItem onClick={() => setTheme('dark')}>Dark</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
