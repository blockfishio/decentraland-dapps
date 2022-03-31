import { EventEmitter } from 'events'
import { PopulatedTransaction, Contract, providers, utils } from 'ethers'
import { Eth } from 'web3x/eth'
import { Address } from 'web3x/address'
import {
  ContractData,
  // ContractName,
  // getContract,
  sendMetaTransaction
} from 'spacey-transactions'
import {
  ChainId,
  getChainName
} from '@spacey2025/schemas/dist/dapps/chain-id'
import {
  getConnectedProvider,
  getConnectedProviderChainId,
  getConnectedProviderType,
  getNetworkProvider
} from '../../lib/eth'
import { getChainConfiguration } from '../../lib/chainConfiguration'
import {

  AddEthereumChainParameters,
  Networks, Wallet
} from './types'
import erc20abi from '../../contracts/ERC20.json'


let TRANSACTIONS_API_URL = 'https://transactions-api.decentraland.co/v1'



export const getTransactionsApiUrl = () => TRANSACTIONS_API_URL
export const setTransactionsApiUrl = (url: string) =>
  (TRANSACTIONS_API_URL = url)



function getSPAYContract(chainId: ChainId) {
  const spayAddresses = {
    [ChainId.ETHEREUM_MAINNET]: '0x58fad9e3c3ae54c9ba98c3f0e4bf88ab3e8cf3c5',
    [ChainId.ETHEREUM_ROPSTEN]: '0x4Eb8f76bC1ec5fCACdE01D909A8Ce87C33fCC80B',
    [ChainId.BSC_MAINNET]: '0x13A637026dF26F846D55ACC52775377717345c06'
  }

  const res = {
    abi: erc20abi,
    address: spayAddresses[chainId],
    name: "SPAY",
    version: "1.0",
    chainId: chainId
  }
  return res
}




export async function fetchManaBalance(chainId: ChainId, address: string) {
  try {
    const provider = await getNetworkProvider(chainId)
    const contract = getSPAYContract(chainId)
    const mana = new Contract(
      contract.address,
      contract.abi,
      new providers.Web3Provider(provider)
    )
    const balance = await mana.balanceOf(address)
    return parseFloat(utils.formatEther(balance))
  } catch (error) {
    return 0
  }
}

export async function buildWallet(): Promise<Wallet> {
  const provider = await getConnectedProvider()

  if (!provider) {
    // This could happen if metamask is not installed
    throw new Error('Could not connect to Ethereum')
  }

  const eth = new Eth(provider)

  const accounts: Address[] = await eth.getAccounts()
  if (accounts.length === 0) {
    // This could happen if metamask was not enabled
    throw new Error('Could not get address')
  }

  const address = accounts[0].toString()
  const chainId = await eth.getId()
  const chainConfig = getChainConfiguration(chainId)
  const expectedChainId = getConnectedProviderChainId()!
  const expectedChainConfig = getChainConfiguration(expectedChainId)
  const networks: Partial<Networks> = {}

  for (const network of Object.keys(chainConfig.networkMapping)) {
    const networkChainId = expectedChainConfig.networkMapping[network]
    networks[network] = {
      chainId: networkChainId,
      mana: await fetchManaBalance(networkChainId, address)
    }
  }

  return {
    address: address.toLowerCase(),
    providerType: getConnectedProviderType()!,
    networks: networks as Networks,
    network: chainConfig.network,
    chainId
  }
}

export async function getTargetNetworkProvider(chainId: ChainId) {
  const networkProvider = await getNetworkProvider(chainId)
  return new providers.Web3Provider(networkProvider)
}

export enum TransactionEventType {
  ERROR = 'error',
  SUCCESS = 'success'
}

export type TransactionEventData<T extends TransactionEventType> = {
  type: T
} & (T extends TransactionEventType.ERROR
  ? { error: Error }
  : T extends TransactionEventType.SUCCESS
  ? { txHash: string }
  : {})

export const transactionEvents = new EventEmitter()

export async function sendTransaction(
  contract: ContractData,
  getPopulatedTransaction: (
    populateTransaction: Contract['populateTransaction']
  ) => Promise<PopulatedTransaction>
) {
  try {
    // get connected provider
    const connectedProvider = await getConnectedProvider()
    if (!connectedProvider) {
      throw new Error('Provider not connected')
    }

    // get current chain id
    const chainIdHex = await connectedProvider.request({
      method: 'eth_chainId',
      params: []
    })
    const chainId = parseInt(chainIdHex as string, 16)

    // get a provider for the target network
    const targetNetworkProvider = await getTargetNetworkProvider(
      contract.chainId
    )

    // intantiate the contract
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      targetNetworkProvider
    )

    // populate the transaction data
    const unsignedTx = await getPopulatedTransaction(
      contractInstance.populateTransaction
    )

    // if the connected provider is in the target network, use it to sign and send the tx
    if (chainId === contract.chainId) {
      const signer = targetNetworkProvider.getSigner()
      const tx = await signer.sendTransaction(unsignedTx)
      transactionEvents.emit(TransactionEventType.SUCCESS, { txHash: tx.hash })
      return tx.hash
    } else {
      // otherwise, send it as a meta tx
      const txHash = await sendMetaTransaction(
        connectedProvider,
        targetNetworkProvider,
        unsignedTx.data!,
        contract,
        {
          serverURL: getTransactionsApiUrl()
        }
      )
      transactionEvents.emit(TransactionEventType.SUCCESS, { txHash })
      return txHash
    }
  } catch (error) {
    const data: TransactionEventData<TransactionEventType.ERROR> = {
      type: TransactionEventType.ERROR,
      error: error as Error
    }
    transactionEvents.emit(TransactionEventType.ERROR, data)
    throw error
  }
}

export function getAddEthereumChainParameters(
  chainId: ChainId
): AddEthereumChainParameters {
  const hexChainId = '0x' + chainId.toString(16)
  const chainName = getChainName(chainId)!
  const config = getChainConfiguration(chainId)
  switch (chainId) {
    case ChainId.MATIC_MAINNET:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      }
    case ChainId.MATIC_MUMBAI:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
      }
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_KOVAN:
    case ChainId.ETHEREUM_GOERLI:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: [config.rpcURL],
        blockExplorerUrls: ['https://etherscan.io']
      }
    case ChainId.BSC_MAINNET:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ['https://bscscan.com']
      }
    case ChainId.BSC_TESTNET:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        blockExplorerUrls: ['https://testnet.bscscan.com']
      }
  }

}
