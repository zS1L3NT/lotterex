import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

import WalletContext from "../../contexts/WalletContext"

export type PickWinnerModalRef = {
	open: (lottery: AppContract) => void
	close: () => void
}

export default forwardRef(function PickWinnerModal(_, ref: ForwardedRef<PickWinnerModalRef>) {
	const { web3, accountId } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [isLoading, setIsLoading] = useState(false)
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
			setIsLoading(true)
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
				.finally(() => setIsLoading(false))
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Pick Winner">
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
					color="red"
					onClick={handlePickWinner}
					loading={isLoading}
					disabled={!players || players.length < 3}>
					Pick Winner
				</Button>
			</Stack>
		</Modal>
	)
})
