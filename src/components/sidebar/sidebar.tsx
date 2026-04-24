import React from 'react'
import { Sidebar } from './constant'
import { AiOutlineHome } from 'react-icons/ai'
import { HiOutlineUsers } from 'react-icons/hi2'
import { IoBookOutline, IoSettingsOutline } from 'react-icons/io5'
import { PiUsersThree } from 'react-icons/pi'
import { CollapseItems } from './collapse-items'
import { SidebarItem } from './sidebar-item'
import { usePathname } from 'next/navigation'
import { useSidebarContext } from '@/common/hooks/useSideBarContext'
import { changeAndReleaseCollapseItem } from './constant'
import { Image } from '@heroui/react'

const SidebarWrapper = () => {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

  return (
    <aside className="h-screen z-[50] sticky top-0">
      {/* <BurguerButton /> */}
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed}>
          d
        </div>
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <Image
            src="/REC_Logo_RGB.webp"
            alt="REC-Logo"
            width={50}
            className="rounded-none"
            height={50}
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<AiOutlineHome />}
              isActive={pathname === '/'}
              href="/"
            />

            <SidebarItem
              isActive={pathname === '/accounts'}
              title="Party operations"
              icon={<IoSettingsOutline />}
              href="#"
            />
            <CollapseItems
              icon={<HiOutlineUsers />}
              items={changeAndReleaseCollapseItem}
              title="Change and Release"
            />
            <SidebarItem
              isActive={pathname === '/users'}
              title="users"
              icon={<HiOutlineUsers />}
            />
            <SidebarItem
              isActive={pathname === '#'}
              title="Commmittes"
              icon={<PiUsersThree />}
            />
            <SidebarItem
              isActive={pathname === '#'}
              title="Rec Wiki and Service Desk"
              icon={<IoBookOutline />}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
export default SidebarWrapper
