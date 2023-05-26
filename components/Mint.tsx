import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { MintButton } from "./mint/MintButton";
import { DeployContract } from "./deploy/DeployContract";
import { NFTMetadata, NFTAttributes, Address, IpfsTokenURI } from "../types";

type Props = {
  nftMetadata: NFTMetadata;
  tokenURI: IpfsTokenURI;
  ipfsHash: string;
  contractAddress: Address;

  wallets: { name: string; content: string }[];
};
export const Mint = ({
  nftMetadata,
  tokenURI,
  ipfsHash,
  wallets = [],
  contractAddress,
}: Props) => {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const attributes = nftMetadata.attributes.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.trait_type]: cur.value,
    };
  }, {}) as NFTAttributes;

  const [, imageIPFSHash] = nftMetadata.image.split("ipfs://");
  const image = `https://ipfs.io/ipfs/${imageIPFSHash}`;
  const value = {
    title: nftMetadata.name,
    url: attributes.URL,
    image,
    timestamp: attributes.Timestamp,
    text: attributes.Text,
    contractAddress,
    wallets,
  };

  const testNet = "sepolia.";
  const [walletState] = useState(
    value.wallets[0].name + "::" + value.wallets[0].content
  );
  const contractLink = `https://${testNet}etherscan.io/address/${value?.contractAddress}`;
  const dateTime = mounted ? new Date(value.timestamp).toLocaleString() : "";

  const recipientAddress = walletState.split("::")[1];

  return (
    <div className="container mx-auto flex py-6 md:flex-row flex-col">
      <div className="lg:flex-grow md:w-1/2 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
        <div className="w-full">
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Title</span>
            <span className="ml-auto text-gray-900 text-xs">{value.title}</span>
          </div>
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">URL</span>
            <span className="ml-auto text-gray-900 text-xs">{value.url}</span>
          </div>
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Date</span>
            <span className="ml-auto text-gray-900 text-xs">{dateTime}</span>
          </div>
          <div className="flex border-t border-gray-200 py-2 flex-col">
            <span className="text-gray-500">Text Content</span>
            <textarea
              rows={10}
              disabled
              className="ml-auto text-gray-400 text-xs w-full border border-gray-200 bg-gray-100 p-2 rounded"
              value={value.text}
            />
          </div>
          <div className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">Contract Address</span>
            <span className="ml-auto text-gray-900">
              <a
                target="_blank"
                rel="nofollow noreferrer"
                href={contractLink}
                className="text-blue-500 underline text-xs"
              >
                {value?.contractAddress}
              </a>
            </span>
          </div>
          <div className="flex border-t border-b border-gray-200 py-2">
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
        </div>
        <p className="my-4 leading-relaxed text-xs bg-gray-100 rounded p-4">
          By clicking Mint you we create a transaction on the blockchain to mint
          your NFT. This will cost you a small fee. The SHA 256 hash of your
          html will be used to create the NFT. This means that if you change the
          html of the page the NFT will be different.
        </p>

        <div className="flex w-full">
          <MintButton
            disabled={!mounted || !isConnected}
            contractAddress={value.contractAddress as Address}
            recipientAddress={recipientAddress as Address}
            tokenURI={tokenURI}
          />
        </div>
      </div>
      <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
        <img
          className="object-cover object-center rounded border"
          alt="hero"
          src={value.image}
        />
      </div>
    </div>
  );
};
