import { useRouter } from "next/router";
import { NFTMetadata, NFTAttributes } from "../types";

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
  if (!address && !tx) return "";
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

export const getAttributesAsKeys = (nftMetadata: NFTMetadata | null) => {
  return nftMetadata?.attributes.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.trait_type]: cur.value,
    };
  }, {}) as NFTAttributes;
};

export const getImagURIFromIPFS = (ipfsHash?: string) => {
  if (!ipfsHash) return null;
  const hash = ipfsHash.replace("ipfs://", "");
  // @todo loading

  return `https://ipfs.io/ipfs/${hash}`;
};

export const fetchData = async (ipfsHash: string) => {
  try {
    const hash = ipfsHash.replace("ipfs://", "");
    const response = await fetch(`https://ipfs.io/ipfs/${hash}`);

    if (response.ok) {
      const data = await response.json();
      // Process the retrieved data here
      return data;
    } else {
      // Handle error response
    }
  } catch (error) {
    // Handle fetch error
  }
  return null;
};

export const trimHash = (
  hash: `0x${string}` | string | null,
  prefix: number,
  suffix: number
) => {
  if (!hash) return "";
  return (
    hash.substring(0, prefix) + "..." + hash.substring(hash.length - suffix)
  );
};
