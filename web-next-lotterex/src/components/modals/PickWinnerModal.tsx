import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { Contract } from "web3"

import { Badge, Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"

import WalletContext from "../../contexts/WalletContext"

export type PickWinnerModalRef = {
	open: (lottery: Contract) => void
	close: () => void
}

export default forwardRef(function PickWinnerModal(_, ref: ForwardedRef<PickWinnerModalRef>) {
	const { web3, accountId } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [lottery, setLottery] = useState<Contract | null>(null)
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
	}, [lottery])

	useEffect(() => {
		if (!opened) {
			setBalance(0)
			setPlayers([])
		}
	}, [opened])

	useEffect(() => {
		if (web3 && accountId && lottery) {
			lottery.methods
				.manager()
				.call({ from: accountId })
				.then((managerId: string) => {
					if (managerId === accountId) {
						lottery.methods
							.getBalance()
							.call({ from: accountId })
							.then((b: string) => +web3.utils.fromWei(b))
							.then(setBalance)
							.catch((error: Error) => {
								notifications.show({
									withCloseButton: true,
									autoClose: false,
									title: "Error getting lottery balance",
									message: error.message,
									color: "red",
									icon: <IconX />
								})
							})
						lottery.methods
							.getPlayers()
							.call({ from: accountId })
							.then(setPlayers)
							.catch((error: Error) => {
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
				})
				.catch((error: Error) => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error entering lottery",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
		}
	}, [web3, accountId, lottery])

	const handlePickWinner = () => {
		if (accountId && lottery) {
			lottery.methods
				.pickWinner()
				.send({ from: accountId, gas: 100_000 })
				.then(close)
				.catch((error: Error) => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error picking lottery winner",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
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
					disabled={!players || players.length < 3}>
					Pick Winner
				</Button>
			</Stack>
		</Modal>
	)
})
