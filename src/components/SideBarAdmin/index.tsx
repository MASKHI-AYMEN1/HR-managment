import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { menuAdminItems } from '@/common/constants/menuAdminItems'
import { LOGO_ICON } from '@/assets/images'
import { CUSTOMER_HOME_PATH } from '@/common/constants/paths'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import { filterMenuItemsByPermissions } from '@/common/utils/permissions'

export default function Index() {
  const router = useRouter()
  const { useGetCurrentUser } = useAuthenticationAPI()
  const { data: user } = useGetCurrentUser()

  // Filter menu items based on user permissions
  const filteredMenuItems = useMemo(() => {
    return filterMenuItemsByPermissions(menuAdminItems, user?.permissions)
  }, [user?.permissions])

  return (
    <>
      <div className="h-screen z-[50] sticky left-0 select-none bg-white dark:bg-gray-900 flex flex-col gap-4 items-center">
        <div className="p-4 bg-white dark:bg-gray-900">
          <Link href={CUSTOMER_HOME_PATH}>
            <img src={LOGO_ICON} alt="Logo" height="18" width="60" />
          </Link>
        </div>
        <div className="flex flex-col  items-center ml-5">
          {filteredMenuItems.map((item, index) => (
            item.enabled && (
            <motion.div
              key={index}
              className={`[&>.tooltip]:hover:opacity-100 h-16 w-16 cursor-pointer border-r-4 py-2  ${router.asPath.includes(item.href) ? 'border-r-yellow-600' : 'border-r-transparent '}`}
              whileHover={{ scale: 1.3 }}
            >
              <Link href={item.href}>
                <motion.div
                  className="border-gray pointer-events-auto absolute flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600 text-white border-gray-100 border-opacity-90 border-2 dark:border-yellow-900 dark:text-yellow-900 shadow hover:shadow-lg "
                  whileHover={item.hover}
                  transition={{ duration: 2 }}
                >
                  {item.icon}
                </motion.div>
              </Link>
              <div className="tooltip absolute z-50 mt-3 ml-12 w-max rounded-md bg-black p-1 text-xs text-white dark:bg-white dark:text-black opacity-0 shadow-md duration-200">
                {item.label}
              </div>
            </motion.div>
          )))}
        </div>
      </div>
    </>
  )
}
