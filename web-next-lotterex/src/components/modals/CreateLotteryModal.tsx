import { ForwardedRef, forwardRef, useContext, useImperativeHandle, useState } from "react"

import { Button, Code, Modal, Stack, TextInput } from "@mantine/core"
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
	const [name, setName] = useState("")

	useImperativeHandle(ref, () => ({ open, close }))

	const handleCreate = async () => {
		if (web3 && accountId) {
			new web3.eth.Contract(LotterexArtifact.abi as any)
				.deploy({
					data: LotterexArtifact.bytecode,
					arguments: [name]
				})
				.send({
					from: accountId,
					value: 0,
					gas: 1_500_000
				})
				.once("receipt", receipt => {
					addLotteryId(receipt.contractAddress!)
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
				<Button
					variant="light"
					color="green"
					onClick={handleCreate}
					disabled={!name}>
					Create
				</Button>
			</Stack>
		</Modal>
	)
})
