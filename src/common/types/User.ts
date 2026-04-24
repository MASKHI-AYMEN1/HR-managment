
export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: UserRole[]
  profilePicture: string
  userType: string
  isVerified: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
  google_id?: number
  address?: string
  permissions?: { [module: string]: string }  // {module: level}
}


export type RegistrationUserType = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  repassword: string
}

export type UpdateUserType = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type UserRole = 'user' | 'admin' 