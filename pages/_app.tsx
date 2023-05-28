import "../styles/globals.css";
import { useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  sepolia,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [sepolia, polygonMumbai]
      : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Content NFT",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   let registration: ServiceWorkerRegistration | null = null;
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker.register("/service-worker.js?2").then(
  //       function (reg) {
  //         registration = reg;
  //         console.log(
  //           "ServiceWorker registration successful with scope: ",
  //           reg.scope
  //         );
  //       },
  //       function (err) {
  //         console.log("ServiceWorker registration failed: ", err);
  //       }
  //     );
  //   }
  //   return () => {
  //     if (registration) {
  //       registration.unregister();
  //     }
  //   };
  // }, []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
