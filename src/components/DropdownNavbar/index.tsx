import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  User,
  AvatarIcon,
  Avatar,
} from '@heroui/react'
import { FaPlus } from 'react-icons/fa'
import { dropdownClass } from './constant'

export default function DropdownNavbar() {
  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200',
        content: 'p-0 border-small border-divider bg-background',
      }}
    >
      <DropdownTrigger>
        <Button color="default" variant="light" className="capitalize">
          <span className=" inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
            <span className="font-medium leading-none text-white">LA</span>
          </span>
          <span className="mx-2">Leslie Alexander</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={['profile']}
        className="p-3"
        itemClasses={dropdownClass}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem isReadOnly key="profile" className="h-14 gap-2">
            <User
              name="Leslie Alexander"
              description="@leslieAlexander"
              classNames={{
                name: 'text-default-600',
                description: 'text-default-500',
              }}
              avatarProps={
                <Avatar
                  isBordered
                  icon={<AvatarIcon />}
                  classNames={{
                    base: 'bg-lime-500',
                    icon: 'text-white',
                  }}
                  size="lg"
                />
              }
            />
          </DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem key="new_project" endContent={<FaPlus />}>
            New Issue
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout">Log Out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
