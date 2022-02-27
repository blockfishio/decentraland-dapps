import { ChainId } from '@spacey2025/schemas/dist/dapps/chain-id'

export type Props = {
  chainId: ChainId
  children: (enabled: boolean) => React.ReactNode
}
