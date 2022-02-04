import { Network } from '@spacey/schemas/dist/dapps/network'

export type Props = {
  network: Network
  children: (enabled: boolean) => React.ReactNode
}
