import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"
import { Contract } from "web3"

import { Box, Button, Modal, NumberInput, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import WalletContext from "../../contexts/WalletContext"

export type LotteryModalRef = {
	open: (lottery: Contract) => void
	close: () => void
}

export default forwardRef(function LotteryModal(_, ref: ForwardedRef<LotteryModalRef>) {
	const { web3, accountId } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [lottery, setLottery] = useState<Contract | null>(null)
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
	}, [lottery])

	useEffect(() => {
		if (accountId && lottery) {
			lottery.methods.name().call().then(setName)
			lottery.methods.hasEntered().call({ from: accountId }).then(setHasEntered)
		}
	}, [accountId, lottery])

	const handleEnterLottery = () => {
		if (web3 && accountId && lottery) {
			lottery.methods
				.enter()
				.send({ from: accountId, value: web3.utils.toWei(cost.toString(), "ether") })
				.then(() => {
					setHasEntered(true)
					close()
				})
		}
	}

	const handleLeaveLottery = () => {
		if (web3 && accountId && lottery) {
			lottery.methods
				.leave()
				.send({ from: accountId })
				.then(() => {
					setHasEntered(false)
					close()
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
