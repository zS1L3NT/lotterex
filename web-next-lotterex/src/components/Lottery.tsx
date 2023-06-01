import { useContext, useEffect, useState } from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Code, Flex, Paper, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"

import WalletContext from "../contexts/WalletContext"
import { useRouter } from "next/router"

export default function Lottery({
	lottery,
	mode,
	onPickWinner,
	onEnterLottery
}: {
	lottery: AppContract
	mode: "User" | "Developer"
	onPickWinner: () => void
	onEnterLottery: () => void
}) {
	const { accountId } = useContext(WalletContext)
	const router = useRouter()

	const [open, setOpen] = useState<boolean | null>(null)
	const [name, setName] = useState<string | null>(null)
	const [managerId, setManagerId] = useState<string | null>(null)
	const [hasEntered, setHasEntered] = useState<boolean | null>(null)

	useEffect(() => {
		if (accountId) {
			lottery.methods.open!<boolean>()
				.call({ from: accountId })
				.then(setOpen)
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
	}, [router, accountId])

	useEffect(() => {
		if (accountId && open) {
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
	}, [router, accountId, open])

	return (
		<Paper
			sx={theme => ({
				cursor: open || mode === "Developer" ? "pointer" : "not-allowed",
				transition: "box-shadow 0.2s ease",
				":hover": {
					boxShadow: theme.shadows.sm
				}
			})}
			shadow="xs"
			p="md"
			onClick={() =>
				open || mode === "Developer"
					? managerId === accountId
						? onPickWinner()
						: onEnterLottery()
					: null
			}>
			<Box>
				<Flex
					gap="0.5rem"
					align="center">
					<Title order={3}>{name}</Title>
					{!open && <Badge color="red">CLOSED</Badge>}
					{managerId === accountId && <Badge color="green">OWNER</Badge>}
					{hasEntered && <Badge color="yellow">ENTERED</Badge>}
				</Flex>
				<Code>{lottery.options.address}</Code>
			</Box>
		</Paper>
	)
}
