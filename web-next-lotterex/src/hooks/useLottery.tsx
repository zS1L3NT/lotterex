import { useContext, useEffect, useState } from "react"
import { AppContract } from "web3-eth-contract"
import WalletContext from "../contexts/WalletContext"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"
import { useRouter } from "next/router"

const useLottery = (lottery: AppContract | null) => {
	const { web3, accountId } = useContext(WalletContext)
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [name, setName] = useState<string | null>(null)
	const [managerId, setManagerId] = useState<string | null>(null)
	const [price, setPrice] = useState<number | null>(null)
	const [players, setPlayers] = useState<string[] | null>(null)
	const [balance, setBalance] = useState<number | null>(null)
	const [hasEntered, setHasEntered] = useState<boolean | null>(null)

	useEffect(() => {
		if (lottery && web3 && accountId) {
			lottery.methods.open!<boolean>()
				.call({ from: accountId })
				.then(setOpen)
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery open",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
			lottery.methods.name!<string>()
				.call({ from: accountId })
				.then(setName)
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery name",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
			lottery.methods.manager!<string>()
				.call({ from: accountId })
				.then(managerId => {
					setManagerId(managerId)

					if (managerId === accountId) {
						lottery.methods.getPlayers!<string[]>()
							.call({ from: accountId })
							.then(setPlayers)
							.catch(error => {
								notifications.show({
									withCloseButton: true,
									autoClose: false,
									title: "Error getting lottery players",
									message: error.message,
									color: "red",
									icon: <IconX />
								})
							})
						lottery.methods.getBalance!<number>()
							.call({ from: accountId })
							.then(b => +web3.utils.fromWei(b + ""))
							.then(setBalance)
							.catch(error => {
								notifications.show({
									withCloseButton: true,
									autoClose: false,
									title: "Error getting lottery balance",
									message: error.message,
									color: "red",
									icon: <IconX />
								})
							})
					}
				})
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery manager",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
			lottery.methods.price!<number>()
				.call({ from: accountId })
				.then(b => +web3.utils.fromWei(b + ""))
				.then(setPrice)
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery price",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
			lottery.methods.hasEntered!<boolean>()
				.call({ from: accountId })
				.then(setHasEntered)
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery manager",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
			}
	}, [router, lottery, web3, accountId])

	return {
		open,
		name,
		managerId,
		price,
		players,
		balance,
		hasEntered
	}
}

export default useLottery