import { ProviderType } from '@spacey2025/schemas/dist/dapps/provider-type'
import { LoginModalOptionType } from "spacey-ui/dist/components/LoginModal/LoginModal";
import {
  isCoinbaseProvider,
  isCucumberProvider, isDapperProvider
} from "../../lib/eth";

const {
  METAMASK,
  DAPPER,
  SAMSUNG,
  FORTMATIC_BSC,
  FORTMATIC_ETH,
  COINBASE,
  WALLET_CONNECT
} = LoginModalOptionType

export function toModalOptionType(providerType: ProviderType): LoginModalOptionType | undefined {
  switch (providerType) {
    case ProviderType.INJECTED:
      if (isCucumberProvider()) {
        return SAMSUNG
      } else if (isCoinbaseProvider()) {
        return COINBASE
      } else if (isDapperProvider()) {
        return DAPPER
      } else {
        return METAMASK
      }
    case ProviderType.FORTMATIC_BSC:
      return FORTMATIC_BSC
    case ProviderType.FORTMATIC_ETH:
      return FORTMATIC_ETH
    case ProviderType.WALLET_CONNECT:
      return WALLET_CONNECT
    default:
      console.warn(`Invalid provider type ${providerType}`)
      return
  }
}

export function toProviderType(modalOptionType: LoginModalOptionType): ProviderType {
  switch (modalOptionType) {
    case METAMASK:
    case COINBASE:
    case DAPPER:
    case SAMSUNG:
      return ProviderType.INJECTED
    case FORTMATIC_BSC:
      return ProviderType.FORTMATIC_BSC
    case FORTMATIC_ETH:
      return ProviderType.FORTMATIC_ETH
    case WALLET_CONNECT:
      return ProviderType.WALLET_CONNECT
    default:
      throw new Error(`Invalid login type ${modalOptionType}`)
  }
}