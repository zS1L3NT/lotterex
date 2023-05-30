import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"

import { LotteriesProvider } from "../contexts/LotteriesContext"
import { WalletProvider } from "../contexts/WalletContext"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS>
			<Notifications />
			<WalletProvider>
				<LotteriesProvider>
					<Component {...pageProps} />
				</LotteriesProvider>
			</WalletProvider>
		</MantineProvider>
	)
}
