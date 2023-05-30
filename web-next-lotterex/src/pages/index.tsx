import { useContext, useRef } from "react"

import { ActionIcon, Badge, Box, Code, Flex, Stack, Title, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"

import CreateLotteryModal, { CreateLotteryModalRef } from "../components/modals/CreateLotteryModal"
import EnterLotteryModal, { EnterLotteryModalRef } from "../components/modals/EnterLotteryModal"
import PickWinnerModal, { PickWinnerModalRef } from "../components/modals/PickWinnerModal"
import LotteriesContext from "../contexts/LotteriesContext"
import WalletContext from "../contexts/WalletContext"

export default function Index() {
	const { lotteries } = useContext(LotteriesContext)
	const { account } = useContext(WalletContext)
	const theme = useMantineTheme()

	const isBelowXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

	const createLotteryModalRef = useRef<CreateLotteryModalRef>(null)
	const enterLotteryModalRef = useRef<EnterLotteryModalRef>(null)
	const pickWinnerModalRef = useRef<PickWinnerModalRef>(null)

	return (
		<>
			<Stack
				sx={theme => ({ maxWidth: theme.breakpoints.xs })}
				mt="3rem"
				mx={isBelowXs ? "md" : "auto"}>
				<Flex
					justify="space-between"
					align="center">
					<Title>Lotteries</Title>
					<ActionIcon
						variant="light"
						size={36}
						onClick={() => createLotteryModalRef.current?.open()}>
						<IconPlus size={24} />
					</ActionIcon>
				</Flex>
				{lotteries.map(l => (
					<Box
						key={l.address}
						sx={theme => ({
							border: "1px solid " + theme.colors.gray[3],
							borderRadius: theme.radius.sm,
							cursor: "pointer",
							transition: "background-color 0.2s ease",
							":hover": {
								backgroundColor: theme.colors.gray[0]
							}
						})}
						p="md">
						<Box>
							<Flex
								gap="0.5rem"
								align="center">
								<Title order={3}>{l.name}</Title>
								{l.manager === account && <Badge color="red">OWNER</Badge>}
							</Flex>
							<Code>{l.address}</Code>
						</Box>
					</Box>
				))}
			</Stack>

			<CreateLotteryModal ref={createLotteryModalRef} />
			<EnterLotteryModal ref={enterLotteryModalRef} />
			<PickWinnerModal ref={pickWinnerModalRef} />
		</>
	)
}
