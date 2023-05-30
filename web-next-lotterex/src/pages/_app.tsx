import { MantineProvider } from "@mantine/core"

import { WalletProvider } from "../contexts/WalletContext"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS>
			<WalletProvider>
				<Component {...pageProps} />
			</WalletProvider>
		</MantineProvider>
	)
}
