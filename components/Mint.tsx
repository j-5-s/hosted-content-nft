import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { MintButton } from "./mint/MintButton";
import { NFTMetadata, NFTAttributes, Address, IpfsTokenURI } from "../types";
import { SlowImageLoader } from "./image/SlowImageLoader";
import { getFirstQueryParam } from "./util";
import { ContractAddressSelector } from "./mint/ContractAddressSelector";
import type { Contract } from "../db/db";
import type { ChainData } from "../hooks/useContract";
import { useRouter } from "next/router";
import { Trait } from "./mint/Trait";

type Props = {
  nftMetadata: NFTMetadata;
  chainData?: ChainData;
  tokenURI: IpfsTokenURI;
  ipfsHash: string;
  contractAddress: Address;
};
export const Mint = ({
  nftMetadata,
  tokenURI,
  ipfsHash,
  contractAddress,
  chainData,
}: Props) => {
  const { isConnected } = useAccount();
  const network = useNetwork();
  const router = useRouter();
  const { switchNetwork, chains } = useSwitchNetwork();
  const [mounted, setMounted] = useState(false);
  const [selectedContract, setSelectedContract] = useState("");

  const updateContractQueryParam = (
    contractAddress: string,
    network?: string
  ) => {
    const query = {
      ...router.query,
      contractAddress,
      network: network || router.query.network,
    };
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const attributes = nftMetadata.attributes.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.trait_type]: cur.value,
    };
  }, {}) as NFTAttributes;

  console.log(nftMetadata.attributes);

  const [, imageIPFSHash] = nftMetadata.image.split("ipfs://");
  const image = `https://ipfs.io/ipfs/${imageIPFSHash}`;
  const value = {
    title: nftMetadata.name,
    url: attributes.URL,
    image,
    timestamp: attributes.Timestamp,
    text: attributes.Text,
    contractAddress,
  };

  // const contractLink = getUrl({
  //   address: value?.contractAddress,
  //   network: network.chain?.network,
  // });

  const handleContractChange = (contract: Contract | undefined) => {
    setSelectedContract(contract?.address || "");

    if (contract?.network) {
      const chain = chains.find((chain) => chain.network === contract.network);
      updateContractQueryParam(contract?.address, chain?.network);
      if (chain && switchNetwork) {
        switchNetwork(chain.id);
      }
    }
  };
  const dateTime = mounted ? new Date(value.timestamp).toLocaleString() : "";

  return (
    <div className="container mx-auto flex py-6 md:flex-row flex-col">
      <div className="lg:flex-grow md:w-1/2 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
        <div className="w-full">
          {nftMetadata.attributes.map((attr, index) => (
            <Trait key={index} trait={attr} />
          ))}
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Metadata (IPFS)</span>
            <span className="ml-auto text-gray-900">
              <a
                target="_blank"
                rel="noreferrer nofollow"
                className="text-blue-500 hover:underline text-xs"
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
              >
                ipfs://{ipfsHash}
              </a>
            </span>
          </div>
          <div className="flex border-t border-b border-gray-200 py-2">
            <span className="text-gray-500">Image (IPFS)</span>
            <span className="ml-auto text-gray-900">
              <a
                target="_blank"
                rel="noreferrer nofollow"
                className="text-blue-500 hover:underline text-xs"
                href={value.image}
              >
                {nftMetadata?.image}
              </a>
            </span>
          </div>
        </div>
        <p className="my-4 leading-relaxed text-xs bg-gray-100 rounded p-4">
          By clicking Mint you will create a transaction on the blockchain to
          mint your NFT. This will cost you a small fee. The SHA 256 hash of
          your html will be used to create the NFT. This means that if you
          change the html of the page the NFT will be different.
        </p>

        <div className="flex w-full flex-col">
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Network</span>
            <div className="ml-auto text-gray-900 text-xs flex items-center">
              {network?.chain?.network}
            </div>
          </div>
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Contract Address</span>
            <div className="ml-auto text-gray-900 flex">
              <ContractAddressSelector
                defaultValue={value?.contractAddress}
                onChange={handleContractChange}
              />
            </div>
          </div>
          <MintButton
            disabled={!mounted || !isConnected}
            contractAddress={selectedContract as Address}
            chainData={chainData}
            tokenURI={tokenURI}
            url={value.url}
          />
        </div>
      </div>
      <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
        <SlowImageLoader
          src={value.image}
          alt="hero"
          className="object-cover object-center rounded border"
        />
      </div>
    </div>
  );
};
