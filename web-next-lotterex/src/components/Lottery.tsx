import { RefObject, useContext } from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Code, Flex, Paper, Title } from "@mantine/core"

import WalletContext from "../contexts/WalletContext"
import useLottery from "../hooks/useLottery"
import { DeveloperModalRef } from "./modals/DeveloperModal"
import { ManagerModalRef } from "./modals/ManagerModal"
import { UserModalRef } from "./modals/UserModal"

export default function LotteryComponent({
	lottery,
	mode,
	userModalRef,
	managerModalRef,
	developerModalRef
}: {
	lottery: AppContract
	mode: "User" | "Developer"
	userModalRef: RefObject<UserModalRef>
	managerModalRef: RefObject<ManagerModalRef>
	developerModalRef: RefObject<DeveloperModalRef>
}) {
	const { accountId } = useContext(WalletContext)

	const { open, name, managerId, hasEntered } = useLottery(lottery)

	return (
		<Paper
			sx={theme => ({
				cursor: open || mode === "Developer" ? "pointer" : "not-allowed",
				transition: "box-shadow 0.2s ease",
				":hover": {
					boxShadow: open || mode === "Developer" ? theme.shadows.sm : theme.shadows.xs
				}
			})}
			shadow="xs"
			p="md"
			onClick={() =>
				mode === "Developer"
					? developerModalRef.current?.open(lottery)
					: open
					? managerId === accountId
						? managerModalRef.current?.open(lottery)
						: userModalRef.current?.open(lottery)
					: null
			}>
			<Box>
				<Flex
					gap="0.5rem"
					align="center">
					<Title order={3}>{name}</Title>
					{!open && <Badge color="red">CLOSED</Badge>}
					{managerId === accountId && <Badge color="green">OWNER</Badge>}
					{hasEntered && <Badge color="yellow">ENTERED</Badge>}
				</Flex>
				<Code>{lottery.options.address}</Code>
			</Box>
		</Paper>
	)
}
