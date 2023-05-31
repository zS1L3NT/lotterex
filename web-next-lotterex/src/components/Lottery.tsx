import { useContext, useEffect, useState } from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Code, Flex, Paper, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"

import WalletContext from "../contexts/WalletContext"

export default function Lottery({
	lottery,
	onPickWinner,
	onEnterLottery
}: {
	lottery: AppContract
	onPickWinner: () => void
	onEnterLottery: () => void
}) {
	const { accountId } = useContext(WalletContext)

	const [name, setName] = useState<string | null>(null)
	const [managerId, setManagerId] = useState<string | null>(null)

	useEffect(() => {
		if (accountId) {
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
	}, [accountId])

	return (
		<Paper
			sx={theme => ({
				cursor: "pointer",
				transition: "box-shadow 0.2s ease",
				":hover": {
					boxShadow: theme.shadows.sm
				}
			})}
			shadow="xs"
			p="md"
			onClick={() => (managerId === accountId ? onPickWinner() : onEnterLottery())}>
			<Box>
				<Flex
					gap="0.5rem"
					align="center">
					<Title order={3}>{name}</Title>
					{managerId === accountId && <Badge color="red">OWNER</Badge>}
				</Flex>
				<Code>{lottery.options.address}</Code>
			</Box>
		</Paper>
	)
}
