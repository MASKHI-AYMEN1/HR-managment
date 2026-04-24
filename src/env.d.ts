type EnvVariables = {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_BASE_URL: string
  NEXT_PUBLIC_FRONT_URL: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}

export {}
