import { ButtonProps } from 'spacey-ui/dist/components/Button/Button'
import { Network } from '@spacey/schemas/dist/dapps/network'

export type Props = ButtonProps & {
  network: Network
}
