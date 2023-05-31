import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { AppContract } from "web3-eth-contract"

import { Box, Button, Code, Modal, NumberInput, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

import WalletContext from "../../contexts/WalletContext"

export type LotteryModalRef = {
	open: (lottery: AppContract) => void
	close: () => void
}

export default forwardRef(function LotteryModal(_, ref: ForwardedRef<LotteryModalRef>) {
	const { web3, accountId } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [lottery, setLottery] = useState<AppContract | null>(null)
	const [name, setName] = useState<string | null>(null)
	const [hasEntered, setHasEntered] = useState<boolean | null>(null)
	const [cost, setCost] = useState<number>(0.1)

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
		if (accountId && lottery) {
			lottery.methods.name!<string>()
				.call()
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
			lottery.methods.hasEntered!<boolean>()
				.call({ from: accountId })
				.then(setHasEntered)
				.catch(error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error getting lottery entry status",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
		}
	}, [accountId, lottery])

	const handleEnterLottery = () => {
		if (web3 && accountId && lottery) {
			web3.eth
				.sendTransaction({
					from: accountId,
					to: lottery.options.address,
					value: +web3.utils.toWei(cost.toString(), "ether") + 100_000
				})
				.once("receipt", receipt => {
					setHasEntered(true)
					setCost(0.1)
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Entered Lottery",
						message: <Code>{receipt.transactionHash}</Code>,
						color: "green",
						icon: <IconCheck />
					})
				})
				.on("error", error => {
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
	}

	const handleLeaveLottery = () => {
		if (web3 && accountId && lottery) {
			lottery.methods.leave!()
				.send({ from: accountId })
				.once("receipt", receipt => {
					setHasEntered(false)
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Left Lottery",
						message: <Code>{receipt.transactionHash}</Code>,
						color: "green",
						icon: <IconCheck />
					})
				})
				.on("error", error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error leaving lottery",
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
			title="Lottery">
			<Stack>
				<Box>
					<Text>Name:</Text>
					<Text weight={700}>{name}</Text>
				</Box>

				{!hasEntered ? (
					<>
						<NumberInput
							label="Cost in ETH"
							description="Must be 0.1 ETH"
							precision={2}
							hideControls
							value={cost}
							onChange={e => setCost(e || 0)}
						/>

						<Button
							variant="light"
							color="green"
							onClick={handleEnterLottery}
							disabled={hasEntered === null || hasEntered}>
							Enter Lottery
						</Button>
					</>
				) : (
					<Button
						variant="light"
						color="red"
						onClick={handleLeaveLottery}>
						Leave Lottery
					</Button>
				)}
			</Stack>
		</Modal>
	)
})
