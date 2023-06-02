import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { MintButton } from "./mint/MintButton";
import { NFTMetadata, NFTAttributes, Address, IpfsTokenURI } from "../types";
import { SlowImageLoader } from "./image/SlowImageLoader";
import { ContractAddressSelector } from "./mint/ContractAddressSelector";
import type { Contract } from "../db/db";
import type { ChainData } from "../hooks/useContract";
import { useRouter } from "next/router";
import { Trait } from "./mint/Trait";
import { ContractMeta, MintForm, SubmitData } from "./mint/MintForm";

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
  const [contractMeta, setContractMeta] = useState<ContractMeta | null>(null);
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

  const [error, setError] = useState<Error | null>(null);
  const handleError = (error: Error) => {
    setError(error);
  };
  const handleLoad = (contractMeta: ContractMeta) => {
    setContractMeta(contractMeta);
  };

  useEffect(() => {
    setError(null);
  }, [contractAddress]);

  const handleSubmit = (data: SubmitData) => {
    if (data.success) {
      router.push(`/address/${contractAddress}`);
    }
  };

  return (
    <MintForm
      tokenURI={tokenURI}
      url={value.url}
      chainData={chainData}
      contractAddress={contractAddress}
      className="container mx-auto flex py-6 md:flex-row flex-col"
      onError={handleError}
      onLoad={handleLoad}
      onSubmit={handleSubmit}
    >
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
          {error && (
            <div className="border overflow-scroll text-xs mb-4 p-4 border-red-200 bg-gray-100">
              {error.message}
            </div>
          )}
          <MintButton
            isOwner={contractMeta?.data?.isOwner}
            value={contractMeta?.data?.clonePrice}
            symbol={network?.chain?.nativeCurrency?.symbol}
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
    </MintForm>
  );
};
