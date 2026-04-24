'use client'

import React, { FC } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  User as UserComponent,
} from '@heroui/react'
import { FaUserAlt } from 'react-icons/fa'
import { dropdownClass } from './constant'
import { motion } from 'framer-motion'
import { User } from '@/common/types/User'
import { IoMdLogOut } from 'react-icons/io'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import {
  ADMIN_DASHBOARD_PATH,
  CUSTOMER_HOME_PATH,

} from '@/common/constants/paths'
import { useRouter } from 'next/router'
import { ROLE_CUSTOMER,ROLE_ADMIN } from '@/common/constants/UserRoles'


const DropdownManager: FC = () => {
  const { useLogOut } = useAuthenticationAPI()
  const { mutate } = useLogOut()
  const [user,SetUser] = React.useState<User>()
 const { useGetCurrentUser } = useAuthenticationAPI()
  const { data: currentUser, isLoading, error } = useGetCurrentUser()

  React.useEffect(() => {
    if (currentUser) {
      SetUser(currentUser)
    }
  }, [currentUser])
  const router = useRouter()

  const isManagerUser = (user: User | undefined) => {
    return user && user.roles?.includes(ROLE_CUSTOMER)
  }

  const isAdminUser = (user: User | undefined) => {
    return user && user.roles?.includes(ROLE_ADMIN)
  }

  const handleNavigateToHome = () => {
    router.push(CUSTOMER_HOME_PATH)
  }
  const handleLogOut = () => {
    mutate('', {
      onSuccess: () => {
        handleNavigateToHome()
      },
      onError: () => {},
    })
  }

  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200',
        content:
          'p-0 border-small border-divider bg-background dark:text-white',
      }}
    >
      <DropdownTrigger>
        <motion.div
          className="border-gray pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border bg-amber-400 text-white shadow hover:shadow-lg dark:border-yellow-900 dark:text-yellow-900"
          whileHover={{ scale: 1.3, backgroundColor: 'bg-blue-300' }}
        >
          <FaUserAlt className="text-2xl" />
        </motion.div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={['profile']}
        className="p-3 dark:bg-black dark:text-white text-black"
        itemClasses={dropdownClass}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem isReadOnly key="profile" className="h-14 gap-2">
            <UserComponent
              name={user?.firstName + ' ' + user?.lastName}
              description={user?.email}
              classNames={{
                name: 'text-default-600 ',
                description: 'text-default-500',
              }}
              avatarProps={{
                radius: 'full',
                name: '',
                size: 'sm',
                icon: <FaUserAlt className="text-lg" />,
                classNames: {
                  base: 'bg-gradient-to-br ',
                  icon: 'text-black/50 text-lg dark:text-white',
                },
              }}
            />
          </DropdownItem>

          <DropdownItem
            key="manager-dashboard"
            href={"/manager/dashboard"}
            className={`${isManagerUser(user) ? '' : 'hidden'}`}
          >
            Ran-Bord
          </DropdownItem>

          <DropdownItem
            key="admin-dashboard"
            href={ADMIN_DASHBOARD_PATH}
            className={`${isAdminUser(user) ? '' : 'hidden'}`}
          >
            Tableau de bord
          </DropdownItem>

          <DropdownItem key="profil" href={""}>
            Profil
          </DropdownItem>
          <DropdownItem key="history" href="/customer/history">
            Historique
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem
            color="danger"
            key="help_and_feedback"
            endContent={<IoMdLogOut className="text-lg text-red-300" />}
            onPress={handleLogOut}
          >
            Déconnexion
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}

export default DropdownManager
