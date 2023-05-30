import { ForwardedRef, forwardRef, useContext, useImperativeHandle, useState } from "react"

import { Alert, Button, Modal, Stack, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

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
	const [error, setError] = useState<Error | null>(null)

	useImperativeHandle(ref, () => ({ open, close }))

	const handleCreate = async () => {
		if (web3 && accountId) {
			await new web3.eth.Contract(LotterexArtifact.abi as any)
				.deploy({
					data: LotterexArtifact.bytecode,
					arguments: [name]
				})
				.send({
					from: accountId,
					value: 0,
					gas: 1_500_000
				})
				.once("transactionHash", console.log)
				.once("sent", console.log)
				.once("confirmation", console.log)
				.once("receipt", receipt => {
					console.log(receipt)
					addLotteryId(receipt.contractAddress!)
					close()
				})
				.on("error", setError)
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
				{error && (
					<Alert
						withCloseButton
						onClose={() => setError(null)}
						color="red">
						{error.message}
					</Alert>
				)}
			</Stack>
		</Modal>
	)
})
