import Web3 from "web3"

declare module "web3-eth-contract" {
	type Contract = Web3["eth"]["Contract"] extends new (...any) => infer T ? T : never

	interface AppContractSendMethod<T> extends ContractSendMethod {
		call(options?: CallOptions, callback?: (error: Error, result: any) => void): Promise<T>
	}

	export class AppContract extends Contract {
		methods: Record<string, <T = unknown>() => AppContractSendMethod<T>>
	}
}
