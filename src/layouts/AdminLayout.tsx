import SideBarAdmin from '@/components/SideBarAdmin'
import HeaderAdmin from '@/features/HeaderAdmin'
// import SubHeaderAdmin from '@/features/HeaderAdmin/SubHeaderAdmin'
import { useTheme } from 'next-themes'
import React, { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div
      className="flex h-screen"
      style={{
        background:
          theme === 'dark'
            ? "url('/images/dark-bg.avif') top left / 256px 256px repeat "
            : "url('/images/light-bg.jpg') top left / 256px 256px repeat",
      }}
    >
      <div className="h-full bg-transparent sticky top-0">
        <SideBarAdmin />
      </div>

      <div className="flex-1 overflow-auto p-5">
        <HeaderAdmin />
        {/* <SubHeaderAdmin /> */}
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
