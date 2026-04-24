import React from 'react'
import { User } from '@heroui/react'

interface IconAvatarProps {
  name: string
  description?: string
  fallback?: React.ReactNode
  className?: string
}

const IconAvatar: React.FC<IconAvatarProps> = ({ name, description, fallback, className }) => {
  return (
    <User
      avatarProps={{
        radius: 'lg',
        fallback,
      }}
      description={description}
      name={name}
      className={className}
    >
      {name}
    </User>
  )
}

export default IconAvatar
