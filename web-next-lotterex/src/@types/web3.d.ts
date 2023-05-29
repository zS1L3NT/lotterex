import Web3 from "web3"

declare module "web3" {
	declare type Contract = Web3["eth"]["Contract"] extends new (...any) => infer T ? T : never
}
