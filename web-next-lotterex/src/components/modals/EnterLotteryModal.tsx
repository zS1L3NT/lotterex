import {
	ForwardedRef, forwardRef, useContext, useEffect, useImperativeHandle, useState
} from "react"

import { Box, Button, Modal, NumberInput, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import WalletContext from "../../contexts/WalletContext"

export type EnterLotteryModalRef = {
	open: (address: string) => void
	close: () => void
}

export default forwardRef(function EnterLotteryModal(_, ref: ForwardedRef<EnterLotteryModalRef>) {
	const { web3, account, contract } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [address, setAddress] = useState<string | null>(null)
	const [name, setName] = useState<string | null>(null)
	const [hasEntered, setHasEntered] = useState<boolean | null>(null)
	const [cost, setCost] = useState<number>(0.1)

	useImperativeHandle(ref, () => ({
		open: address => {
			setAddress(address)
			open()
		},
		close
	}))

	useEffect(() => {
		close()
	}, [account])

	useEffect(() => {
		if (contract) {
			contract.methods.name().call().then(setName)
			contract.methods.hasEntered().call({ from: account }).then(setHasEntered)
		}
	}, [contract])

	const handleEnterLottery = () => {
		if (web3 && account && address && contract) {
			contract.methods
				.enter()
				.send({
					from: account,
					value: web3.utils.toWei(cost.toString(), "ether")
				})
				.then(console.log)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Enter Lottery">
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
						color="red">
						Leave Lottery
					</Button>
				)}
			</Stack>
		</Modal>
	)
})
