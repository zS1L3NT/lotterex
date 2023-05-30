import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { Contract } from "web3"

import { Badge, Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

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
	const [winner, setWinner] = useState<string | null>(null)

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
						lottery.methods.getPlayers().call({ from: accountId }).then(setPlayers)
					} else {
						console.warn({ managerId, accountId })
					}
				})
		}
	}, [web3, accountId, lottery])

	const handlePickWinner = () => {
		if (accountId && lottery) {
			lottery.methods
				.pickWinner()
				.send({ from: accountId })
				.then((result: any) => {
					setWinner(result.events.Winner.returnValues.winner)
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
								color={winner ? (winner === "p" ? "green" : "gray") : "blue"}>
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
