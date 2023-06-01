import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

import WalletContext from "../../contexts/WalletContext"
import { useRouter } from "next/router"

export type ManagerModalRef = {
	open: (lottery: AppContract) => void
	close: () => void
}

export default forwardRef(function ManagerModal(_, ref: ForwardedRef<ManagerModalRef>) {
	const { web3, accountId } = useContext(WalletContext)
	const router = useRouter()

	const [opened, { open, close }] = useDisclosure(false)
	const [isPickWinnerLoading, setIsPickWinnerLoading] = useState(false)
	const [isCloseLoading, setIsCloseLoading] = useState(false)
	const [lottery, setLottery] = useState<AppContract | null>(null)
	const [managerId, setManagerId] = useState<string | null>(null)
	const [balance, setBalance] = useState<number | null>(null)
	const [players, setPlayers] = useState<string[] | null>(null)

	useImperativeHandle(ref, () => ({
		open: lottery => {
			setLottery(lottery)
			open()
		},
		close
	}))

	useEffect(() => {
		close()
	}, [accountId])

	useEffect(() => {
		if (web3 && accountId && lottery) {
			lottery.methods.manager!<string>()
				.call({ from: accountId })
				.then(setManagerId)
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
	}, [web3, accountId, lottery])

	useEffect(() => {
		if (web3 && accountId && lottery && managerId === accountId) {
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
		}
	}, [web3, accountId, lottery, managerId])

	const handlePickWinner = () => {
		if (accountId && lottery) {
			setIsPickWinnerLoading(true)
			lottery.methods.pickWinner!()
				.send({ from: accountId, gas: 100_000 })
				.once("receipt", receipt => {
					setBalance(0)
					setPlayers([])
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Picked Lottery Winner",
						message: <Code>{receipt.transactionHash}</Code>,
						color: "green",
						icon: <IconCheck />
					})
				})
				.on("error", error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error picking lottery winner",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
				.finally(() => setIsPickWinnerLoading(false))
		}
	}

	const handleClose = () => {
		if (accountId && lottery) {
			setIsCloseLoading(true)
			lottery.methods.close!()
				.send({ from: accountId, gas: 150_000 })
				.once("receipt", receipt => {
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Closed Lottery",
						message: <Code>{receipt.transactionHash}</Code>,
						color: "green",
						icon: <IconCheck />
					})
					router.push(router.asPath)
				})
				.on("error", error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error closing lottery",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
				.finally(() => setIsCloseLoading(false))
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Manage Lottery">
			<Stack>
				<Box>
					<Text>Balance: </Text>
					<Code>{balance} ETH</Code>
				</Box>
				<Box>
					<Text>Players:</Text>
					{players?.length ? (
						players.map(p => (
							<Badge
								key={p}
								color="blue">
								{p}
							</Badge>
						))
					) : (
						<Badge color="red">No Players</Badge>
					)}
				</Box>
				<Button
					variant="light"
					color="green"
					onClick={handlePickWinner}
					loading={isPickWinnerLoading}
					disabled={!players || players.length < 3}>
					Pick Winner
				</Button>
				<Button
					variant="light"
					color="red"
					onClick={handleClose}
					loading={isCloseLoading}>
					Close Lottery
				</Button>
			</Stack>
		</Modal>
	)
})
