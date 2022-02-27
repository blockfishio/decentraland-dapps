import { ButtonProps } from 'spacey-ui/dist/components/Button/Button'
import { ChainId } from '@spacey2025/schemas/dist/dapps/chain-id'

export type Props = ButtonProps & {
  chainId: ChainId
}
