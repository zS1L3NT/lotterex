import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { AppContract } from "web3-eth-contract"

import { Box, Button, Code, Modal, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

import WalletContext from "../../contexts/WalletContext"
import { useRouter } from "next/router"

export type UserModalRef = {
	open: (lottery: AppContract) => void
	close: () => void
}

export default forwardRef(function UserModal(_, ref: ForwardedRef<UserModalRef>) {
	const { web3, accountId } = useContext(WalletContext)
	const router = useRouter()

	const [opened, { open, close }] = useDisclosure(false)
	const [isLoading, setIsLoading] = useState(false)
	const [lottery, setLottery] = useState<AppContract | null>(null)
	const [name, setName] = useState<string | null>(null)
	const [price, setPrice] = useState<number | null>(null)
	const [hasEntered, setHasEntered] = useState<boolean | null>(null)

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
			lottery.methods.price!<number>()
				.call()
				.then(v => +web3!.utils.fromWei(v + ""))
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
						title: "Error getting lottery entry status",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
		}
	}, [accountId, lottery])

	const handleEnterLottery = () => {
		if (web3 && accountId && lottery && price) {
			setIsLoading(true)
			web3.eth
				.sendTransaction({
					from: accountId,
					to: lottery.options.address,
					value: +web3.utils.toWei(price + "", "ether") + 100_000
				})
				.once("receipt", receipt => {
					setHasEntered(true)
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Entered Lottery",
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
						title: "Error entering lottery",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
				.finally(() => setIsLoading(false))
		}
	}

	const handleLeaveLottery = () => {
		if (web3 && accountId && lottery) {
			setIsLoading(true)
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
					router.push(router.asPath)
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
				.finally(() => setIsLoading(false))
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

				<Box>
					<Text>Price:</Text>
					<Text weight={700}>{price} ETH</Text>
				</Box>

				{!hasEntered ? (
					<Button
						variant="light"
						color="green"
						onClick={handleEnterLottery}
						loading={isLoading}
						disabled={hasEntered === null || hasEntered}>
						Enter Lottery
					</Button>
				) : (
					<Button
						variant="light"
						color="red"
						onClick={handleLeaveLottery}
						loading={isLoading}>
						Leave Lottery
					</Button>
				)}
			</Stack>
		</Modal>
	)
})
