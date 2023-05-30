import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { Contract } from "web3"

import LotterexArtifact from "../contracts/Lotterex.json"
import WalletContext from "./WalletContext"

const LotteriesContext = createContext({
	lotteries: [] as Contract[],
	addLotteryId: (lotteryId: string) => {}
})

export default LotteriesContext
export const LotteriesProvider = ({ children }: PropsWithChildren) => {
	const artifact = LotterexArtifact as any
	const { web3 } = useContext(WalletContext)

	const [lotteries, setLotteries] = useState<Contract[]>([])

	useEffect(() => {
		if (web3) {
			const lotteryIds = JSON.parse(localStorage.getItem("lotteries") || "[]") as string[]
			setLotteries(lotteryIds.map(l => new web3.eth.Contract(artifact.abi, l)))
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
