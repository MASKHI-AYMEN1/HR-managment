export type Credentiel = {
  email: string
  password: string
}

export type CredentielForgetPassword = {
  email: string
}

export type CredentielResetPassword = {
  password: string
  repassword: string
}
