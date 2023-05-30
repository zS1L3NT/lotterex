import { createContext, PropsWithChildren, useEffect, useState } from "react"

const LotteriesContext = createContext({
	lotteries: [] as Lottery[],
	setLotteries: (lotteries: Lottery[]) => {}
})

export default LotteriesContext
export const LotteriesProvider = ({ children }: PropsWithChildren) => {
	const [lotteries, setLotteries] = useState<Lottery[]>([])

	useEffect(() => {
		setLotteries(JSON.parse(localStorage.getItem("lotteries") || "[]"))
	}, [])

	const setLotteriesWithLocalStorage = (lotteries: Lottery[]) => {
		localStorage.setItem("lotteries", JSON.stringify(lotteries))
		setLotteries(lotteries)
	}

	return (
		<LotteriesContext.Provider
			value={{
				lotteries,
				setLotteries: setLotteriesWithLocalStorage
			}}>
			{children}
		</LotteriesContext.Provider>
	)
}
