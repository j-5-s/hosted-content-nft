import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
} from 'wagmi'
import { MintButton } from './mint/MintButton';
import { NFTMetadata, NFTAttributes, Address, IpfsTokenURI } from '../types';

type Props = {
  nftMetadata: NFTMetadata;
  tokenURI: IpfsTokenURI;
  contractAddress: Address;
  wallets: {name: string, content: string}[];
}
export const Mint = ({ nftMetadata, tokenURI, wallets = [], contractAddress }: Props) => {

  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    setMounted(true)
  }, [])

  const attributes = nftMetadata.attributes.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.trait_type]: cur.value,
    }
  }, {}) as NFTAttributes;
  const [_, imageIPFSHash] = nftMetadata.image.split('ipfs://');
  const image = `https://gateway.pinata.cloud/ipfs/${imageIPFSHash}`;
  const value = {
    title: nftMetadata.name,
    url: attributes.URL,
    image,
    timestamp: attributes.Timestamp,
    textSHA256: attributes['Text SHA 256'],
    imageSHA256: attributes['Image SHA 256'],
    // need to be query params

    contractAddress,
    wallets,
  }

  const testNet = 'sepolia.';
  const [walletState, setWalletState] = useState(value.wallets[0].name + '::' + value.wallets[0].content);
  const contractLink = `https://${testNet}etherscan.io/address/${value?.contractAddress}`;
  const dateTime = new Date(value.timestamp).toLocaleString();

  const recipientAddress = walletState.split('::')[1]; 

  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto px-5 flex py-5 flex-col">
        <div className="container mx-auto flex items-center justify-between ">  
          <div className="flex-1 mr-5">
            {value.contractAddress && (
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">
                  Contract Found: {value.contractAddress}
                </span>
              </div>
            )}
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
      <div className="container mx-auto flex px-5 pb-5 flex-col">
        {!value.contractAddress && (
        <div>
          <h1 className="text-3xl font-medium title-font mb-4 text-gray-900">Display create contract if not exist</h1>
        </div>
        )}
      </div>
      <div className="container mx-auto flex px-5 py-6 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Mint NFT
          </h1>
          <div className="w-full">
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Title</span>
              <span className="ml-auto text-gray-900">{value.title}</span>
            </div>
              <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">URL</span>
              <span className="ml-auto text-gray-900">{value.url}</span>
            </div>
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Date</span>
              <span className="ml-auto text-gray-900">{dateTime}</span>
            </div>
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Contract Address</span>
              <span className="ml-auto text-gray-900">
                <a
                  target="_blank"
                  rel="nofollow noreferrer"
                  href={contractLink}
                  className="text-blue-500 underline"
                >
                  {value?.contractAddress}
                </a>
                </span>
            </div>
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Wallet</span>
              <span className="ml-auto text-gray-900">
                <select
                  className="text-gray-900"
                  onChange={(evt) => setWalletState(evt.target.value)}
                  value={walletState}
                >
                <option value="">Select...</option>
                {value.wallets.map((wallet) => (
                  <option
                    key={wallet.name + wallet.content}
                    value={wallet.name + '::' + wallet.content}
                  >{wallet.name}: {wallet.content}</option>
                ))}
                </select>
              </span>
            </div>
            

            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Image SHA 256</span>
              <span className="ml-auto text-gray-900">{value.imageSHA256}</span>
            </div>
            <div className="flex border-t border-b mb-6 border-gray-200 py-2">
              <span className="text-gray-500">HTML SHA 256</span>
              <span className="ml-auto text-gray-900">{value.textSHA256}</span>
            </div>
          </div>
          <p className="mb-8 leading-relaxed">
            By clicking Mint you we create a transaction on the blockchain to mint your NFT. This will cost you a small fee.
            The SHA 256 hash of your html will be used to create the NFT. This means that if you change the html of the page
            the NFT will be different.
          </p>
         
          <div className="flex w-full">
            <MintButton
              disabled={(!mounted || !isConnected)}
              contractAddress={value.contractAddress as Address}
              recipientAddress={recipientAddress as Address}
              tokenURI={tokenURI}
            />
           
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded border" alt="hero" src={value.image} />
        </div>
      </div>
    </section>
  );

}