import { RefObject, useContext } from "react"
import { AppContract } from "web3-eth-contract"

import { Badge, Box, Button, Code, Flex, Paper, Title } from "@mantine/core"

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
				display: "flex",
				alignItems: "center",
				gap: "0.5rem",
				transition: "box-shadow 0.2s ease",
				":hover": {
					boxShadow: open || mode === "Developer" ? theme.shadows.sm : theme.shadows.xs
				}
			})}
			shadow="xs"
			p="md">
			<Box mr="auto">
				<Flex
					gap="0.5rem"
					align="center">
					<Title order={3}>{name}</Title>
					{managerId === accountId && <Badge color="yellow">MANAGER</Badge>}
					{!open && <Badge color="red">CLOSED</Badge>}
					{hasEntered && <Badge color="green">ENTERED</Badge>}
				</Flex>
				<Code>{lottery.options.address}</Code>
			</Box>
			{mode === "Developer" && (
				<Button
					variant="light"
					color="yellow"
					onClick={() => developerModalRef.current?.open(lottery)}>
					Developer
				</Button>
			)}
			{open && mode === "User" && managerId === accountId && (
				<Button
					variant="light"
					color="yellow"
					onClick={() => managerModalRef.current?.open(lottery)}>
					Manage
				</Button>
			)}
			{open && mode === "User" && (
				<Button
					variant="light"
					color={hasEntered ? "red" : "green"}
					onClick={() => userModalRef.current?.open(lottery)}>
					{hasEntered ? "Leave" : "Enter"}
				</Button>
			)}
		</Paper>
	)
}
