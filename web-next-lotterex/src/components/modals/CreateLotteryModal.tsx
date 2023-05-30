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
	const { lotteries, setLotteries } = useContext(LotteriesContext)
	const { web3, account, contract } = useContext(WalletContext)

	const [opened, { open, close }] = useDisclosure(false)
	const [name, setName] = useState("")
	const [error, setError] = useState<Error | null>(null)

	useImperativeHandle(ref, () => ({ open, close }))

	const handleCreate = async () => {
		if (web3 && account && contract) {
			await contract
				.deploy({
					data: LotterexArtifact.bytecode,
					arguments: [name]
				})
				.send({
					from: account,
					value: 0,
					gas: 1_500_000
				})
				.once("receipt", receipt => {
					setLotteries([...lotteries, receipt.contractAddress!])
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
