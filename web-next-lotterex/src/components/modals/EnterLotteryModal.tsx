import { ForwardedRef, forwardRef, useImperativeHandle } from "react"

import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

export type EnterLotteryModalRef = {
	open: () => void
	close: () => void
}

export default forwardRef(function EnterLotteryModal(_, ref: ForwardedRef<EnterLotteryModalRef>) {
	const [opened, { open, close }] = useDisclosure(false)

	useImperativeHandle(ref, () => ({ open, close }))

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Enter Lottery"></Modal>
	)
})
