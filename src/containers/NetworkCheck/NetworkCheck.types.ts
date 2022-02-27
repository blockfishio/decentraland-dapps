import { Network } from '@spacey2025/schemas/dist/dapps/network'

export type Props = {
  network: Network
  children: (enabled: boolean) => React.ReactNode
}
