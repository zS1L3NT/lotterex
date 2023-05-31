import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { AppContract } from "web3-eth-contract"

import { Code } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"

import LotterexArtifact from "../contracts/Lotterex.json"
import WalletContext from "./WalletContext"

const LotteriesContext = createContext({
	lotteries: [] as AppContract[],
	addLotteryId: (lotteryId: string) => {}
})

export default LotteriesContext
export const LotteriesProvider = ({ children }: PropsWithChildren) => {
	const artifact = LotterexArtifact as any
	const { web3 } = useContext(WalletContext)

	const [lotteries, setLotteries] = useState<AppContract[]>([])

	useEffect(() => {
		if (web3) {
			const lotteryIds = JSON.parse(localStorage.getItem("lotteries") || "[]") as string[]
			const lotteries = []

			for (const lotteryId of lotteryIds) {
				try {
					const lottery = new web3.eth.Contract(artifact.abi, lotteryId)
					lotteries.push(lottery)
				} catch {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Invalid Lottery ID",
						message: <Code>{lotteryId}</Code>,
						color: "red",
						icon: <IconX />
					})
				}
			}

			localStorage.setItem("lotteries", JSON.stringify(lotteries.map(l => l.options.address)))
			setLotteries(lotteries)
		}
	}, [web3])

	const addLotteryIdWithLocalStorage = (lotteryId: string) => {
		if (web3) {
			localStorage.setItem(
				"lotteries",
				JSON.stringify([...lotteries.map(l => l.options.address), lotteryId])
			)
			setLotteries(lotteries => [
				...lotteries,
				new web3.eth.Contract(artifact.abi, lotteryId)
			])
		}
	}

	return (
		<LotteriesContext.Provider
			value={{
				lotteries,
				addLotteryId: addLotteryIdWithLocalStorage
			}}>
			{children}
		</LotteriesContext.Provider>
	)
}
