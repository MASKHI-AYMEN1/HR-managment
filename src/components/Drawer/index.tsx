import React, { useState } from 'react'
import {
  Drawer as HeroDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/react'
import { DrawerPortalContext } from './DrawerPortalContext'

interface AppDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
}

const AppDrawer = ({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  size,
}: AppDrawerProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  return (
    <HeroDrawer
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: { opacity: 1, x: 0 },
          exit: { x: 100, opacity: 0 },
        },
      }}
      onOpenChange={onOpenChange}
      size={"md"}
      isDismissable={false}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {title && (
              <DrawerHeader className="flex flex-col gap-1 dark:bg-gray-900 text-black dark:text-white">
                {title}
              </DrawerHeader>
            )}
            <DrawerBody className='dark:bg-gray-900'>
              <div ref={setPortalContainer} style={{ height: '100%' }}>
                <DrawerPortalContext.Provider value={portalContainer}>
                  {children}
                </DrawerPortalContext.Provider>
              </div>
            </DrawerBody>
            {footer && <DrawerFooter className='dark:bg-gray-900'>{footer}</DrawerFooter>}
          </>
        )}
      </DrawerContent>
    </HeroDrawer>
  )
}

export default AppDrawer
