import { ChainId } from '@spacey2025/schemas/dist/dapps/chain-id'
import { Network } from '@spacey2025/schemas/dist/dapps/network'
import { RPC_URLS } from 'spacey-connect/dist/connectors/NetworkConnector'

export const MANA_GRAPH_BY_CHAIN_ID = {
  [ChainId.ETHEREUM_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-ethereum-mainnet',
  [ChainId.ETHEREUM_ROPSTEN]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-ethereum-ropsten',
  [ChainId.ETHEREUM_GOERLI]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-ethereum-goerli',
  [ChainId.ETHEREUM_RINKEBY]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-ethereum-rinkeby',
  [ChainId.MATIC_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-matic-mainnet',
  [ChainId.MATIC_MUMBAI]:
    'https://api.thegraph.com/subgraphs/name/decentraland/mana-matic-mumbai'
}

const NETWORK_MAPPING_BY_CHAIN_ID = {
  [ChainId.ETHEREUM_MAINNET]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_MAINNET,
    [Network.BSC]: ChainId.BSC_MAINNET
  },
  [ChainId.ETHEREUM_ROPSTEN]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_ROPSTEN,
    [Network.BSC]: ChainId.BSC_TESTNET
  },
  [ChainId.ETHEREUM_GOERLI]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_GOERLI,
    [Network.BSC]: ChainId.BSC_TESTNET
  },
  [ChainId.ETHEREUM_RINKEBY]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_RINKEBY,
    [Network.BSC]: ChainId.BSC_TESTNET
  },
  [ChainId.MATIC_MAINNET]: {
    [Network.ETHEREUM]: ChainId.MATIC_MAINNET,
    [Network.BSC]: ChainId.BSC_MAINNET
  },
  [ChainId.MATIC_MUMBAI]: {
    [Network.ETHEREUM]: ChainId.MATIC_MUMBAI,
    [Network.BSC]: ChainId.BSC_MAINNET
  },
  [ChainId.BSC_MAINNET]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_MAINNET,
    [Network.BSC]: ChainId.BSC_MAINNET
  },
  [ChainId.BSC_TESTNET]: {
    [Network.ETHEREUM]: ChainId.ETHEREUM_ROPSTEN,
    [Network.BSC]: ChainId.BSC_TESTNET
  }
}

const NETWORK_BY_CHAIN_ID: Record<ChainId, Network> = {
  [ChainId.ETHEREUM_MAINNET]: Network.ETHEREUM,
  [ChainId.ETHEREUM_ROPSTEN]: Network.ETHEREUM,
  [ChainId.ETHEREUM_GOERLI]: Network.ETHEREUM,
  [ChainId.ETHEREUM_KOVAN]: Network.ETHEREUM,
  [ChainId.ETHEREUM_RINKEBY]: Network.ETHEREUM,
  [ChainId.MATIC_MAINNET]: Network.MATIC,
  [ChainId.MATIC_MUMBAI]: Network.MATIC,
  [ChainId.BSC_MAINNET]: Network.BSC,
  [ChainId.BSC_TESTNET]: Network.BSC
}

type ChainConfiguration = {
  network: Network
  manaGraphURL: string
  rpcURL: string
  networkMapping: Record<Network, ChainId>
}

export function getChainConfiguration(chainId: ChainId): ChainConfiguration {
  return {
    network: NETWORK_BY_CHAIN_ID[chainId],
    manaGraphURL: MANA_GRAPH_BY_CHAIN_ID[chainId],
    rpcURL: RPC_URLS[chainId],
    networkMapping: NETWORK_MAPPING_BY_CHAIN_ID[chainId]
  }
}
