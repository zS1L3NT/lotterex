/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import Web3 from "web3"

const WalletContext = createContext({
	web3: null as Web3 | null,
	networkId: null as number | null,
	accountId: null as string | null
})

export default WalletContext
export const WalletProvider = ({ children }: PropsWithChildren) => {
	const [web3, setWeb3] = useState<Web3 | null>(null)
	const [networkId, setNetworkId] = useState<number | null>(null)
	const [accountId, setAccountId] = useState<string | null>(null)

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
		const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
		const networkId = await web3.eth.net.getId()
		const accountId = (await web3.eth.requestAccounts())[0] ?? null

		setWeb3(web3)
		setNetworkId(networkId)
		setAccountId(accountId)
	}

	return (
		<WalletContext.Provider
			value={{
				web3,
				networkId,
				accountId
			}}>
			{children}
		</WalletContext.Provider>
	)
}
