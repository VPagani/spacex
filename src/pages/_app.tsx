import "./globals.css";

import Head from "next/head";
import * as React from "react";
import { Inter } from "@next/font/google";

import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";

const fontInter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const [queryClient] = React.useState(() => new QueryClient());

	return (
		<main className={fontInter.className}>
			<Head>
				<title>SpaceX Launches</title>
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<link rel="icon" href="/favicon.ico" />
				<script async src="https://www.googleoptimize.com/optimize.js?id=OPT-KTW99F9"></script>
			</Head>

			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} />
				</Hydrate>
			</QueryClientProvider>
		</main>
	);
}
