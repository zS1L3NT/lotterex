import { ForwardedRef, forwardRef, useImperativeHandle } from "react"

import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

export type PickWinnerModalRef = {
	open: () => void
	close: () => void
}

export default forwardRef(function PickWinnerModal(_, ref: ForwardedRef<PickWinnerModalRef>) {
	const [opened, { open, close }] = useDisclosure(false)

	useImperativeHandle(ref, () => ({ open, close }))

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title="Pick Winner"></Modal>
	)
})
