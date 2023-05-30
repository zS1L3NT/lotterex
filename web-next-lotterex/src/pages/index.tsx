import { useContext, useRef } from "react"

import { ActionIcon, Flex, Stack, Title, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"

import Lottery from "../components/Lottery"
import CreateLotteryModal, { CreateLotteryModalRef } from "../components/modals/CreateLotteryModal"
import EnterLotteryModal, { EnterLotteryModalRef } from "../components/modals/EnterLotteryModal"
import PickWinnerModal, { PickWinnerModalRef } from "../components/modals/PickWinnerModal"
import LotteriesContext from "../contexts/LotteriesContext"

export default function Index() {
	const { lotteries } = useContext(LotteriesContext)
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
				{lotteries.map(address => (
					<Lottery
						key={address}
						address={address}
						onPickWinner={() => pickWinnerModalRef.current?.open(address)}
						onEnterLottery={() => enterLotteryModalRef.current?.open(address)}
					/>
				))}
			</Stack>

			<CreateLotteryModal ref={createLotteryModalRef} />
			<EnterLotteryModal ref={enterLotteryModalRef} />
			<PickWinnerModal ref={pickWinnerModalRef} />
		</>
	)
}
