import { menuAdminItems } from '@/common/constants/menuAdminItems'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export default function Index() {
  const router = useRouter()

  return (
    <div className="mb-7 flex justify-between">
      <div>
        {menuAdminItems.map((item, index) => (
          <div key={index}>
            {router.asPath.includes(item.href) ? (
              <div className=" flex justify-start items-center space-x-10 text-blue-300">
                <div>
                  <Link href={item.href}>
                    {' '}
                    <span className="text-3xl font-medium text-black dark:text-white">
                      {' '}
                      {item.title}
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end space-x-4">
      
      </div>
    </div>
  )
}
