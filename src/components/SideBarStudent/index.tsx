import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { menuStudentItems } from '@/common/constants/menuStudentItems'
import { LOGO_ICON } from '@/assets/images'
import DropdownUserMenu from '../DropdownUserMenu'

export default function SideBarStudent() {
  const router = useRouter()

  return (
    <>
      <div className="h-screen z-[50] sticky left-0 select-none bg-white dark:bg-black flex flex-col items-center">
        <div className="p-4 bg-white dark:bg-black">
          <Link href="/student/courses">
            <img src={LOGO_ICON} alt="Logo" height="18" width="60" />
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          {menuStudentItems.map((item, index) => (
            <motion.div
              key={index}
              className={`[&>.tooltip]:hover:opacity-100 h-16 w-16 cursor-pointer border-r-4 py-2 flex items-center justify-center ${router.asPath.includes(item.href) ? 'border-r-yellow-600' : 'border-r-transparent '}`}
              whileHover={{ scale: 1.3 }}
            >
              <Link href={item.href}>
                <motion.div
                  className="border-gray pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 text-white border-gray-100 border-opacity-90 border-2 shadow hover:shadow-lg"
                  whileHover={item.hover}
                  transition={{ duration: 2 }}
                >
                  {item.icon}
                </motion.div>
              </Link>
              <div className="tooltip absolute z-50 ml-16 w-max rounded-md bg-black p-1 text-xs text-white dark:bg-white dark:text-black opacity-0 shadow-md duration-200">
                {item.label}
              </div>
            </motion.div>
          ))}
          <DropdownUserMenu />
        </div>
      </div>
    </>
  )
}
