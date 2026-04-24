import React from 'react'
import { useRouter } from 'next/router'
import { MdArrowBack } from 'react-icons/md'
import Button from '@/components/Button'

interface BackButtonProps {
  onClick?: () => void
  className?: string
  variant?: 'bordered' | 'solid' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

export default function BackButton({ 
  onClick, 
  className = '',
  variant = 'bordered',
  color = 'warning'
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      color={color}
      className={`min-w-fit ${className}`}
    >
      <MdArrowBack className="text-xl text-yellow-600" />
    </Button>
  )
}
