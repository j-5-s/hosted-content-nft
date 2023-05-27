import { useRouter } from "next/router";

export function getFirstQueryParam(key: string) {
  const router = useRouter();
  const param = router.query[key];

  if (Array.isArray(param)) {
    return String(param[0]);
  }

  return String(param || "");
}

type GetURLProps = {
  address?: string | `0x${string}`;
  tx?: string;
  network?: string;
};
export function getUrl({ address, tx, network }: GetURLProps) {
  // `https://${testNet}etherscan.io/tx/${transactionHash}`

  if (network === "maticmum") {
    return `https://mumbai.polygonscan.com/${tx ? "tx" : "address"}/${
      tx || address
    }`;
  } else if (network === "matic") {
    return `https://polygonscan.com/${tx ? "tx" : "address"}/${tx || address}`;
  } else if (network === "sepolia") {
    return `https://${network}.etherscan.io/${
      tx ? "tx" : "address"
    }/${address}`;
  } else if (network === "ethereum") {
    return `https://etherscan.io/${tx ? "tx" : "address"}/${address}`;
  }
}
