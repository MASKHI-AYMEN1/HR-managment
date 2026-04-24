import { Tooltip as HeroTooltip, TooltipPlacement } from '@heroui/react'
import type { ReactNode } from 'react'

export interface AppTooltipProps {
  children?: ReactNode | ReactNode[]
  content?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  placement?: TooltipPlacement
  delay?: number
  closeDelay?: number
  isOpen?: boolean
  defaultOpen?: boolean
  offset?: number
  containerPadding?: number
  crossOffset?: number
  showArrow?: boolean
  shouldFlip?: boolean
  triggerScaleOnOpen?: boolean
  isKeyboardDismissDisabled?: boolean
  isDismissable?: boolean
  shouldCloseOnBlur?: boolean
  motionProps?: any
  portalContainer?: HTMLElement
  updatePositionDeps?: any[]
  isDisabled?: boolean
  disableAnimation?: boolean
  classNames?: Partial<Record<'base' | 'content', string>>
  onOpenChange?: (isOpen: boolean) => void
  shouldCloseOnInteractOutside?: (e: HTMLElement) => void
  onClose?: () => void
}

const AppTooltip = ({
  children,
  content,
  size = 'md',
  color = 'primary',
  radius = 'md',
  shadow = 'sm',
  placement = 'top',
  delay = 500,
  closeDelay = 500,
  isOpen,
  defaultOpen,
  offset = 7,
  containerPadding = 12,
  crossOffset = 0,
  showArrow = false,
  shouldFlip = true,
  triggerScaleOnOpen = true,
  isKeyboardDismissDisabled = false,
  isDismissable = false,
  shouldCloseOnBlur = true,
  motionProps,
  portalContainer,
  updatePositionDeps = [],
  isDisabled = false,
  disableAnimation = false,
  classNames,
  onOpenChange,
  onClose,
}: AppTooltipProps) => (
  <HeroTooltip
    content={content}
    size={size}
    color={color}
    radius={radius}
    shadow={shadow}
    placement={placement}
    delay={delay}
    closeDelay={closeDelay}
    isOpen={isOpen}
    defaultOpen={defaultOpen}
    offset={offset}
    containerPadding={containerPadding}
    crossOffset={crossOffset}
    showArrow={showArrow}
    shouldFlip={shouldFlip}
    triggerScaleOnOpen={triggerScaleOnOpen}
    isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    isDismissable={isDismissable}
    shouldCloseOnBlur={shouldCloseOnBlur}
    motionProps={motionProps}
    portalContainer={portalContainer}
    updatePositionDeps={updatePositionDeps}
    isDisabled={isDisabled}
    disableAnimation={disableAnimation}
    classNames={classNames}
    onOpenChange={onOpenChange}
    onClose={onClose}
  >
    {children}
  </HeroTooltip>
)

export default AppTooltip
