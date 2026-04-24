import React from 'react'
import { useIntl } from 'react-intl'
import { FaCalendarAlt } from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'
import Image from 'next/image'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { TbReportAnalytics } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GiCarWheel } from 'react-icons/gi'
import { IoConstructSharp } from 'react-icons/io5'
import {
  MANAGER_DASHBOARD_PATH,
  MANAGER_GARAGE_PATH,
  MANAGER_MAINTENANCES_PATH,
  MANAGER_CAISSE_PATH,
  MANAGER_CALENDAR_PATH,
  MANAGER_DOCUMENTS_PATH,
  CUSTOMER_HOME_PATH,
} from '@/common/constants/paths'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import { LOGO_ICON } from '@/assets/images'
import useSubscriptionAPI from '@/services/user/useSubscriptionAPI'
import DropdownUserMenu from '../DropdownUserMenu'

export default function Index() {
  const intl = useIntl()
  const router = useRouter()
  const { useGetCurrentUser } = useAuthenticationAPI()
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useGetCurrentUser()
  const { useGetCurrentSubscription } = useSubscriptionAPI()
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error,
  } = useGetCurrentSubscription()

  const handleNavigate = (path: string) => {
    router.push(path)
  }
  if (isLoadingSubscription && isLoadingUser) return
  if (error || errorUser) return

  const menuItems = [
    {
      href: MANAGER_DASHBOARD_PATH,
      icon: <MdSpaceDashboard className="text-2xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.dashboard',
        defaultMessage: 'Dashboard',
      }),
      enable: true,
      hover: {
        rotate: [0, 45, 0, -45, 0],
      },
    },
    {
      href: MANAGER_GARAGE_PATH,
      icon: <GiCarWheel className="text-3xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.vehicles',
        defaultMessage: 'Véhicules',
      }),
      enable: subscriptionData?.package.parc,
      hover: {
        rotate: [360, 180, 0, -360, 360],
      },
    },
    {
      href: MANAGER_MAINTENANCES_PATH,
      icon: <IoConstructSharp className="text-3xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.maintenance',
        defaultMessage: 'Maintenance',
      }),
      enable: subscriptionData?.package.garage,
      hover: {
        rotate: [0, 0, 270, 270, 0],
      },
    },
    {
      href: MANAGER_DOCUMENTS_PATH,
      icon: <TbReportAnalytics className="text-3xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.documents',
        defaultMessage: 'Documents',
      }),
      enable: subscriptionData?.package.garage,
      hover: {
        rotate: 360,
      },
    },
    {
      href: MANAGER_CALENDAR_PATH,
      icon: <FaCalendarAlt className="text-2xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.calendar',
        defaultMessage: 'Calendrier',
      }),
      enable: subscriptionData?.package.reservation,
      hover: {
        rotate: [10, 0, -10, 0, 20, 0, -20],
      },
    },
    {
      href: MANAGER_CAISSE_PATH,
      icon: <RiMoneyDollarCircleLine className="text-3xl dark:text-white" />,
      label: intl.formatMessage({
        id: 'sidebarManager.menu.revenue',
        defaultMessage: 'Revenue',
      }),
      enable: subscriptionData?.package.caisse,
      hover: {
        rotate: 360,
      },
    },
  ]

  return (
    <>
      <div className="h-screen z-[50] sticky left-0 select-none bg-transparent flex flex-col justify-between items-center">
        <div className="p-4 bg-white dark:bg-black">
          <Link href={CUSTOMER_HOME_PATH}>
            <Image
              src={LOGO_ICON}
              alt="logo"
              width={60}
              height={50}
              className="hidden dark:block"
            />
            <Image
              src={LOGO_ICON}
              alt="logo"
              width={60}
              height={50}
              className=" dark:hidden"
            />
          </Link>
        </div>
        <div className="">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className={`[&>.tooltip]:hover:opacity-100 h-16 w-16 cursor-pointer border-r-4 py-3  ${router.asPath.includes(item.href) ? (item.enable && subscriptionData?.status ? 'border-r-blue-300' : 'border-r-gray-300') : 'border-r-transparent '}`}
              whileHover={
                item.enable && subscriptionData?.status ? { scale: 1.3 } : {}
              }
            >
              <div
                onClick={() =>
                  item.enable &&
                  subscriptionData?.status &&
                  handleNavigate(item.href)
                }
              >
                <motion.div
                  className={`border-gray pointer-events-auto absolute flex h-12 w-12 items-center justify-center rounded-full border dark:border-gray-400 dark:border-2 ${item.enable && subscriptionData?.status ? 'bg-blue-300' : 'bg-gray-200'} text-white shadow hover:shadow-inner`}
                  whileHover={
                    item.enable && subscriptionData?.status ? item.hover : {}
                  }
                  transition={{ duration: 2 }}
                >
                  {item.icon}
                </motion.div>
              </div>
              <div
                className={`tooltip absolute z-50 mt-3 ml-12 w-max rounded-md ${item.enable && subscriptionData?.status ? 'bg-blue-400' : 'bg-gray-300'} p-1 text-xs text-white opacity-0 shadow-md duration-200`}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="py-3 h-16 w-16 flex items-center">
          <div
            className={`[&>.tooltip]:hover:opacity-100 border-r-transparent cursor-pointer border-r-4`}
          >
            <DropdownUserMenu user={userData} />
          </div>
        </div>
      </div>
    </>
  )
}
