import { useContext, useRef } from "react"

import { ActionIcon, Alert, Flex, Stack, Title, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconAlertTriangle, IconPlus } from "@tabler/icons-react"

import Lottery from "../components/Lottery"
import CreateLotteryModal, { CreateLotteryModalRef } from "../components/modals/CreateLotteryModal"
import LotteryModal, { LotteryModalRef } from "../components/modals/LotteryModal"
import PickWinnerModal, { PickWinnerModalRef } from "../components/modals/PickWinnerModal"
import LotteriesContext from "../contexts/LotteriesContext"
import WalletContext from "../contexts/WalletContext"
import LotteriesArtifact from "../contracts/Lotterex.json"

export default function Index() {
	const { networkId } = useContext(WalletContext)
	const { lotteries } = useContext(LotteriesContext)
	const theme = useMantineTheme()

	const isBelowXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

	const createLotteryModalRef = useRef<CreateLotteryModalRef>(null)
	const lotteryModalRef = useRef<LotteryModalRef>(null)
	const pickWinnerModalRef = useRef<PickWinnerModalRef>(null)

	const isCorrectNetwork = networkId + "" in LotteriesArtifact.networks

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
				{isCorrectNetwork ? (
					lotteries.map(lottery => (
						<Lottery
							key={lottery.options.address}
							lottery={lottery}
							onPickWinner={() => pickWinnerModalRef.current?.open(lottery)}
							onEnterLottery={() => lotteryModalRef.current?.open(lottery)}
						/>
					))
				) : (
					<Alert
						icon={<IconAlertTriangle />}
						color="red"
						title="Wrong Network">
						Your Wallet is not connected to the network of the smart contracts
					</Alert>
				)}
			</Stack>

			{isCorrectNetwork && (
				<>
					<CreateLotteryModal ref={createLotteryModalRef} />
					<LotteryModal ref={lotteryModalRef} />
					<PickWinnerModal ref={pickWinnerModalRef} />
				</>
			)}
		</>
	)
}
