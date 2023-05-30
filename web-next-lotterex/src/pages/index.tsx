import { useContext, useRef } from "react"

import { ActionIcon, Flex, Stack, Title, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconPlus } from "@tabler/icons-react"

import Lottery from "../components/Lottery"
import CreateLotteryModal, { CreateLotteryModalRef } from "../components/modals/CreateLotteryModal"
import LotteryModal, { LotteryModalRef } from "../components/modals/LotteryModal"
import PickWinnerModal, { PickWinnerModalRef } from "../components/modals/PickWinnerModal"
import LotteriesContext from "../contexts/LotteriesContext"

export default function Index() {
	const { lotteries } = useContext(LotteriesContext)
	const theme = useMantineTheme()

	const isBelowXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

	const createLotteryModalRef = useRef<CreateLotteryModalRef>(null)
	const lotteryModalRef = useRef<LotteryModalRef>(null)
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
				{lotteries.map(lottery => (
					<Lottery
						key={lottery.options.address}
						lottery={lottery}
						onPickWinner={() => pickWinnerModalRef.current?.open(lottery)}
						onEnterLottery={() => lotteryModalRef.current?.open(lottery)}
					/>
				))}
			</Stack>

			<CreateLotteryModal ref={createLotteryModalRef} />
			<LotteryModal ref={lotteryModalRef} />
			<PickWinnerModal ref={pickWinnerModalRef} />
		</>
	)
}
