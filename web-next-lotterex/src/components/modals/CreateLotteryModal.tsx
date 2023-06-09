import { ForwardedRef, forwardRef, useContext, useImperativeHandle, useState } from "react"

import { Button, Code, Modal, NumberInput, Stack, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

import LotteriesContext from "../../contexts/LotteriesContext"
import WalletContext from "../../contexts/WalletContext"
import LotterexArtifact from "../../contracts/Lotterex.json"

export type CreateLotteryModalRef = {
	open: () => void
	close: () => void
}

export default forwardRef(function CreateLotteryModal(_, ref: ForwardedRef<CreateLotteryModalRef>) {
	const { addLotteryId } = useContext(LotteriesContext)
	const { web3, accountId } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [isLoading, setIsLoading] = useState(false)
	const [name, setName] = useState("")
	const [price, setPrice] = useState(0.1)

	useImperativeHandle(ref, () => ({ open, close }))

	const handleCreate = async () => {
		if (web3 && accountId) {
			setIsLoading(true)
			new web3.eth.Contract(LotterexArtifact.abi as any)
				.deploy({
					data: LotterexArtifact.bytecode,
					arguments: [name, web3.utils.toWei(price + "", "ether")]
				})
				.send({
					from: accountId,
					value: 0,
					gas: 1_500_000
				})
				.once("receipt", receipt => {
					addLotteryId(receipt.contractAddress!)
					setName("")
					close()
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Created Lottery",
						message: <Code>{receipt.transactionHash}</Code>,
						color: "green",
						icon: <IconCheck />
					})
				})
				.on("error", error => {
					notifications.show({
						withCloseButton: true,
						autoClose: false,
						title: "Error creating lottery",
						message: error.message,
						color: "red",
						icon: <IconX />
					})
				})
				.finally(() => setIsLoading(false))
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Create Lottery">
			<Stack>
				<TextInput
					label="Lottery Name"
					description="The name of the lottery, this will be shown to everyone"
					value={name}
					onChange={e => setName(e.currentTarget.value)}
				/>
				<NumberInput
					label="Entry Price"
					description="The price in ETH to enter the lottery"
					hideControls
					precision={5}
					value={price}
					onChange={e => setPrice(e || 0.1)}
				/>
				<Button
					variant="light"
					color="green"
					onClick={handleCreate}
					loading={isLoading}
					disabled={!name}>
					Create
				</Button>
			</Stack>
		</Modal>
	)
})
