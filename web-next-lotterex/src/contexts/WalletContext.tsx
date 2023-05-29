/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import Web3, { Contract } from "web3"

import LotterexArtifact from "../contracts/Lotterex.json"

const WalletContext = createContext({
	web3: null as Web3 | null,
	accounts: null as string[] | null,
	networkID: null as number | null,
	contract: null as Contract | null
})

export default WalletContext
export const WalletProvider = ({ children }: PropsWithChildren) => {
	const [web3, setWeb3] = useState<Web3 | null>(null)
	const [accounts, setAccounts] = useState<string[] | null>(null)
	const [networkID, setNetworkID] = useState<number | null>(null)
	const [contract, setContract] = useState<Contract | null>(null)

	useEffect(() => {
		updateWallet()

		window.ethereum.on("chainChanged", updateWallet)
		window.ethereum.on("accountsChanged", updateWallet)

		return () => {
			window.ethereum.removeListener("chainChanged", updateWallet)
			window.ethereum.removeListener("accountsChanged", updateWallet)
		}
	}, [])

	const updateWallet = async () => {
		const artifact = LotterexArtifact as any
		const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
		const accounts = await web3.eth.requestAccounts()
		const networkID = await web3.eth.net.getId()

		let contract: Contract | null = null
		try {
			contract = new web3.eth.Contract(artifact.abi, artifact.networks[networkID].address)
		} catch (e) {
			console.error("Error reading contract information:", e)
		}

		setWeb3(web3)
		setAccounts(accounts)
		setNetworkID(networkID)
		setContract(contract)
	}

	return (
		<WalletContext.Provider
			value={{
				web3,
				accounts,
				networkID,
				contract
			}}>
			{children}
		</WalletContext.Provider>
	)
}
