import { Avatar } from 'spacey-ui/dist/types/avatar'

export type Profile = {
  avatars: Avatar[]
}

export type EntityDeploymentError = {
  message: string
  code?: number
}
