import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"

import { Badge, Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import WalletContext from "../../contexts/WalletContext"

export type PickWinnerModalRef = {
	open: (address: string) => void
	close: () => void
}

export default forwardRef(function PickWinnerModal(_, ref: ForwardedRef<PickWinnerModalRef>) {
	const { account, contract } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [address, setAddress] = useState<string | null>(null)
	const [balance, setBalance] = useState<number | null>(null)
	const [players, setPlayers] = useState<string[] | null>(null)
	const [winner, setWinner] = useState<string | null>(null)

	useImperativeHandle(ref, () => ({
		open: address => {
			setAddress(address)
			open()
		},
		close
	}))

	useEffect(() => {
		close()
	}, [account])

	useEffect(() => {
		if (address && account && contract) {
			contract.methods
				.manager()
				.call({ from: account })
				.then((manager: string) => {
					if (manager === account) {
						contract.methods.getBalance().call({ from: account }).then(setBalance)
						contract.methods.getPlayers().call({ from: account }).then(setPlayers)
					} else {
						console.warn({ manager, account })
					}
				})
		}
	}, [address, account, contract])

	const handlePickWinner = () => {
		if (account && contract) {
			contract.methods
				.pickWinner()
				.send({ from: account })
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
					<Code>{balance}</Code>
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
