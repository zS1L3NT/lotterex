import {
	ForwardedRef, forwardRef, Fragment, useContext, useImperativeHandle, useState
} from "react"
import { AppContract } from "web3-eth-contract"

import {
	Alert, Box, Button, Divider, Flex, Modal, NumberInput, ScrollArea, Skeleton, Stack, Text,
	useMantineTheme
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import WalletContext from "../../contexts/WalletContext"
import LotterexArtifact from "../../contracts/Lotterex.json"

export type DeveloperModalRef = {
	open: (lottery: AppContract) => void
	close: () => void
}

function Method({
	lottery,
	method
}: {
	lottery: AppContract | null
	method: (typeof LotterexArtifact.abi)[number]
}) {
	const { web3, accountId } = useContext(WalletContext)

	const [isLoading, setIsLoading] = useState(false)
	const [amount, setAmount] = useState(0)
	const [data, setData] = useState<any>(null)
	const [error, setError] = useState<Error | null>(null)

	const handleClick = () => {
		if (web3 && accountId && lottery) {
			setIsLoading(true)
			if (method.stateMutability === "view") {
				lottery.methods[method.name!]!()
					.call({ from: accountId })
					.then(v => v + "")
					.then(data => {
						setData(data)
						setError(null)
					})
					.catch(error => {
						setData(null)
						setError(error)
					})
					.finally(() => setIsLoading(false))
			} else if (method.type === "receive") {
				web3.eth
					.sendTransaction({
						from: accountId,
						to: lottery.options.address,
						value: web3.utils.toWei(amount + "", "ether")
					})
					.once("receipt", receipt => {
						setData(receipt.transactionHash)
						setAmount(0)
						setError(null)
					})
					.on("error", error => {
						setData(null)
						setAmount(0)
						setError(error)
					})
					.finally(() => setIsLoading(false))
			} else {
				lottery.methods[method.name!]!()
					.send({ from: accountId })
					.once("receipt", receipt => {
						setData(receipt.transactionHash)
						setError(null)
					})
					.on("error", error => {
						setData(null)
						setError(error)
					})
					.finally(() => setIsLoading(false))
			}
		}
	}

	return (
		<Stack spacing="xs">
			{method.type === "receive" && (
				<NumberInput
					label="Amount to send"
					description="Amount of ETH to send to the contract"
					hideControls
					value={amount}
					onChange={a => setAmount(a || 0)}
				/>
			)}

			<Flex
				justify="space-between"
				align="center"
				gap="md">
				<Box>
					<Text weight={700}>
						{method.stateMutability === "view" ? "Output:" : "Transaction Hash:"}
					</Text>
					{data === null ? (
						<Skeleton
							w={250}
							h={24.8}
						/>
					) : (
						<Text sx={{ wordBreak: "break-all" }}>{data}</Text>
					)}
				</Box>

				<Button
					variant="light"
					color={
						method.stateMutability === "view"
							? "green"
							: method.type === "receive"
							? "red"
							: "yellow"
					}
					onClick={handleClick}
					loading={isLoading}>
					{method.name ?? "send"}
				</Button>
			</Flex>
			{error && (
				<Alert
					sx={{ wordBreak: "break-all" }}
					color="red">
					{error.message}
				</Alert>
			)}
		</Stack>
	)
}

export default forwardRef(function DeveloperModal(_, ref: ForwardedRef<DeveloperModalRef>) {
	const theme = useMantineTheme()

	const [opened, { open, close }] = useDisclosure(false)
	const [lottery, setLottery] = useState<AppContract | null>(null)

	useImperativeHandle(ref, () => ({
		open: lottery => {
			setLottery(lottery)
			open()
		},
		close
	}))

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			size="lg"
			title="Developer"
			scrollAreaComponent={ScrollArea.Autosize}>
			<Stack>
				{LotterexArtifact.abi
					.filter(m => m.type === "function")
					.map((method, i) => (
						<Fragment key={i}>
							<Method
								lottery={lottery}
								method={method}
							/>
							<Divider color={theme.colors.gray[2]} />
						</Fragment>
					))}
				<Method
					lottery={lottery}
					method={LotterexArtifact.abi.filter(m => m.type === "receive")[0]!}
				/>
			</Stack>
		</Modal>
	)
})
