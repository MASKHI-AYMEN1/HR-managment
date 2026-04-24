export type CustomResponse<T> = {
  message: string
  result: Array<T>
}

export type CustomResponseObj<T> = {
  message: string
  result: T
}

export type StringMessage = { message: string }
export type ResOne<T> = { result: Array<T> } & StringMessage
export type ResTwo<T> = { result: T } & StringMessage
export type ResThree<T> = { result: { data: T } } & StringMessage
export type ResFour<T> = { result: { data: Array<T> } } & StringMessage
export type ResFive<T> = { extractionToolAreaTreeItems: Array<T> }
export type ResSix<T> = { result: { permissions: T } } & StringMessage
export type ResSeven<T> = { data: T } & StringMessage


export type APIResponse<T> = T extends {
  result: unknown
} & StringMessage
  ? T
  : T extends ResFive<infer U>
    ? ResFive<U>
    : never
