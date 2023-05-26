import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Mint } from "../../components/Mint";
import { Header } from "../../components/header";
import { NFTMetadata, Address, IpfsTokenURI } from "../../types";
import { Progress } from "../../components/progress/Progress";
type PageProps = {
  // Define the shape of the props returned by getServerSideProps
  // based on your specific data requirements
  ipfsHash: string;
  contractAddress: string;
  wallets: { name: string; content: string }[];
};

const fetchDataFromPinata = async (ipfsHash: string) => {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);

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

type QueryParams = {
  ipfsHash?: string;
  contractAddress?: string;
  wallet?: string | string[];
};
export const parseQueryParams = (query: QueryParams) => {
  let ipfsHash = query?.ipfsHash || "";
  let contractAddress = query?.contractAddress || "";
  let wallet = query?.wallet || "";
  if (Array.isArray(ipfsHash)) {
    ipfsHash = ipfsHash[0];
  }
  if (Array.isArray(contractAddress)) {
    contractAddress = contractAddress[0];
  }

  if (!Array.isArray(wallet)) {
    if (wallet) {
      wallet = [wallet];
    } else {
      wallet = [];
    }
  }

  return {
    ipfsHash,
    contractAddress,
    wallets: wallet.map((w: string) => {
      const [name, content] = w.split("::");
      return { name, content };
    }),
  };
};

const MintPage: NextPage<PageProps> = () => {
  const router = useRouter();
  const { ipfsHash, wallets, contractAddress } = parseQueryParams(router.query);
  const [nftMetadata, setNFTMetadata] = useState<NFTMetadata | null>(null);
  const tokenURI: IpfsTokenURI = `ipfs://${ipfsHash}`;
  // @todo better error handling

  useEffect(() => {
    if (!ipfsHash) return;
    (async () => {
      try {
        const data = await fetchDataFromPinata(ipfsHash);
        setNFTMetadata(data);
      } catch (ex) {
        console.log(ex);
      }
    })();
  }, [ipfsHash]);

  if (router.isReady && (!ipfsHash || !wallets[0] || !contractAddress)) {
    return (
      <div>
        Bad request. Please try again. Make sure to have the following query
        params: ipfsHash, contractAddress, wallet
      </div>
    );
  }

  const loading = !nftMetadata;

  return (
    <section className="text-gray-600 body-font">
      <Header step={4}>
        <h1 className="title-font sm:text-4xl text-3x font-medium text-gray-900">
          Mint NFT
        </h1>
      </Header>
      <div className="container mx-auto flex pb-5 flex-col">
        {loading && <div className="mt-5">Loading...</div>}
        {!loading && (
          <Mint
            nftMetadata={nftMetadata}
            tokenURI={tokenURI}
            ipfsHash={ipfsHash}
            wallets={wallets}
            contractAddress={contractAddress as Address}
          />
        )}
      </div>
    </section>
  );
};

export default MintPage;
