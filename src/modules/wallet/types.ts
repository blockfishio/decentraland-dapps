import { ChainId } from '@spacey2025/schemas/dist/dapps/chain-id'
import { Network } from '@spacey2025/schemas/dist/dapps/network'
import { Provider } from 'spacey-connect/dist/types'
import { ProviderType } from '@spacey2025/schemas/dist/dapps/provider-type'

export { Provider, ProviderType }

export type NetworkData = {
  mana: number
  chainId: ChainId
}
export type Networks = Record<Network, NetworkData>

export interface Wallet {
  address: string
  networks: Networks
  network: Network
  chainId: ChainId
  providerType: ProviderType
}

export interface CreateWalletOptions {
  MANA_ADDRESS?: string
  CHAIN_ID: string | number
  TRANSACTIONS_API_URL?: string
  POLL_INTERVAL?: number
  ALLOWED_IDS?: ChainId[]
}

export type AddEthereumChainParameters = {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

export enum ContractName {

  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  MANAToken = 'MANAToken',
  MarketplaceV2 = 'MarketplaceV2',

}

export type ContractData = {
  abi: object[]
  address: string
  name: string
  version: string
  chainId: ChainId
}