import { INPUT_EMPTY_ERROR } from '@/common/constants/errorMessage'
import { z } from 'zod'

export const LoginFormValidationSchema = z.object({
  email: z
    .string({ required_error: INPUT_EMPTY_ERROR })
    .min(1, { message: INPUT_EMPTY_ERROR }),
  password: z
    .string({ required_error: INPUT_EMPTY_ERROR })
    .min(1, { message: INPUT_EMPTY_ERROR }),
  remember_me: z.boolean().default(false),
})
export type LoginValidationSchema = z.infer<typeof LoginFormValidationSchema>
