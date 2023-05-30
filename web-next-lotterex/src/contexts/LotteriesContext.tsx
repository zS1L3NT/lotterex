import { createContext, PropsWithChildren, useEffect, useState } from "react"

const LotteriesContext = createContext({
	lotteries: [] as string[],
	setLotteries: (lotteries: string[]) => {}
})

export default LotteriesContext
export const LotteriesProvider = ({ children }: PropsWithChildren) => {
	const [lotteries, setLotteries] = useState<string[]>([])

	useEffect(() => {
		setLotteries(JSON.parse(localStorage.getItem("lotteries") || "[]"))
	}, [])

	const setLotteriesWithLocalStorage = (lotteries: string[]) => {
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
