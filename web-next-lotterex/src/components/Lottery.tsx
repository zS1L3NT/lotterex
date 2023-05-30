import { useContext, useEffect, useState } from "react"
import { Contract } from "web3"

import { Badge, Box, Code, Flex, Paper, Title } from "@mantine/core"

import WalletContext from "../contexts/WalletContext"

export default function Lottery({
	lottery,
	onPickWinner,
	onEnterLottery
}: {
	lottery: Contract
	onPickWinner: () => void
	onEnterLottery: () => void
}) {
	const { accountId } = useContext(WalletContext)

	const [name, setName] = useState<string | null>(null)
	const [managerId, setManagerId] = useState<string | null>(null)

	useEffect(() => {
		if (accountId) {
			lottery.methods.name().call({ from: accountId }).then(setName)
			lottery.methods.manager().call({ from: accountId }).then(setManagerId)
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
