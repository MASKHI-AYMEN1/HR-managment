import type { ReactNode, FC } from 'react'
import type { ComponentWithClassName } from '@/common/types/ComponentWithClassName'
import { Button } from '@heroui/react'

type ButtonComponentProps = {
  children?: ReactNode
  className?: string
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  startContent?: ReactNode
  endContent?: ReactNode
  spinner?: ReactNode
  spinnerPlacement?: 'start' | 'end'
  fullWidth?: boolean
  isIconOnly?: boolean
  isDisabled?: boolean
  disabled?: boolean
  isLoading?: boolean
  disableRipple?: boolean
  disableAnimation?: boolean
  type?: 'button' | 'submit' | 'reset'
  form?: string
  onClick?: (e: any) => void
} & ComponentWithClassName

const ButtonComponent: FC<ButtonComponentProps> = ({
  children,
  className = '',
  variant = 'solid',
  color = 'default',
  size = 'md',
  radius,
  startContent,
  disabled,
  endContent,
  spinner,
  form,
  spinnerPlacement = 'start',
  fullWidth = false,
  isIconOnly = false,
  isDisabled = false,
  isLoading = false,
  disableRipple = false,
  disableAnimation = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <Button
      className={
        'focus:ring-0 text-white text-small font-semibold disabled:bg-blue-100 disabled:text-yellow-500 dark:bg-yellow-700 ' +
        className
      }
      variant={variant}
      color={color}
      isIconOnly 
      size={size}
      radius={radius}
      startContent={startContent}
      endContent={endContent}
      spinner={spinner}
      spinnerPlacement={spinnerPlacement}
      fullWidth={fullWidth}
      isDisabled={isDisabled || disabled}
      isLoading={isLoading}
      disableRipple={disableRipple}
      disableAnimation={disableAnimation}
      type={type}
      form={form}
      onPress={onClick}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default ButtonComponent
