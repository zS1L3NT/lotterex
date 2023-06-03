/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import Web3 from "web3"

const WalletContext = createContext({
	web3: null as Web3 | null,
	networkId: null as number | null,
	accountId: null as string | null
})

export default WalletContext
export const WalletProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter()

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

	useEffect(() => {
		if (web3) {
			const subscription = web3.eth.subscribe("newBlockHeaders")
				.on("data", () => router.push(router.asPath))
				.on("error", () => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error subscribing to new blocks",
						message: "Please refresh the page",
						color: "red",
						icon: <IconX />
					})
				})
			
			return () => {
				subscription.unsubscribe()
			}
		}

		return
	}, [web3])

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
