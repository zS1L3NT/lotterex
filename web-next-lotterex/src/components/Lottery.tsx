import { useContext, useEffect, useState } from "react"

import { Badge, Box, Code, Flex, Paper, Title } from "@mantine/core"

import WalletContext from "../contexts/WalletContext"

export default function Lottery({
	address,
	onPickWinner,
	onEnterLottery
}: {
	address: string
	onPickWinner: () => void
	onEnterLottery: () => void
}) {
	const { account, contract } = useContext(WalletContext)

	const [name, setName] = useState<string | null>(null)
	const [manager, setManager] = useState<string | null>(null)

	useEffect(() => {
		if (account && contract) {
			contract.methods.name().call({ from: account }).then(setName)
			contract.methods.manager().call({ from: account }).then(setManager)
		}
	}, [account, contract])

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
			onClick={() => (manager === account ? onPickWinner() : onEnterLottery())}>
			<Box>
				<Flex
					gap="0.5rem"
					align="center">
					<Title order={3}>{name}</Title>
					{manager === account && <Badge color="red">OWNER</Badge>}
				</Flex>
				<Code>{address}</Code>
			</Box>
		</Paper>
	)
}
