import { ChainId } from '@spacey2025/schemas/dist/dapps/chain-id'
import { ContractName } from 'spacey-transactions'

export enum AuthorizationType {
  ALLOWANCE = 'allowance',
  APPROVAL = 'approval'
}

export enum AuthorizationAction {
  GRANT = 'grant',
  REVOKE = 'revoke'
}

export type Authorization = {
  type: AuthorizationType
  address: string
  contractAddress: string
  authorizedAddress: string
  contractName: ContractName
  chainId: ChainId
}
