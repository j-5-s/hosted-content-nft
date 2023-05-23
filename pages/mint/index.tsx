import {  useState, useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { Mint } from '../../components/Mint'; 
import Head from 'next/head';
import { Header } from '../../components/header';
import { NFTMetadata, Address, IpfsTokenURI } from '../../types';

type PageProps = {
  // Define the shape of the props returned by getServerSideProps
  // based on your specific data requirements
  ipfsHash: string;
  contractAddress: string;
  wallets: {name: string, content: string}[];
};

const fetchDataFromPinata = async (ipfsHash: string) => {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  let ipfsHash = context?.query?.ipfsHash || '';
  let contractAddress = context?.query?.contractAddress || '';
  let wallet = context?.query?.wallet || '';
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
 
  const ret = { 
    props: {
      ipfsHash,
      contractAddress,
      wallets: wallet.map((w) => {
        const [name, content] = w.split('::');
        return {name, content};
      })
    }
  };

  return ret;
}

const MintPage: NextPage<PageProps> = ({ ipfsHash, wallets, contractAddress }) => {
  const [nftMetadata, setNFTMetadata] = useState<NFTMetadata | null>(null);
  const tokenURI: IpfsTokenURI = `ipfs://${ipfsHash}`;
  // @todo better error handling

  useEffect(() => {
    if (!ipfsHash) return;
    (async () => {
      try {
        const data = await fetchDataFromPinata(ipfsHash);
        setNFTMetadata(data);
      } catch(ex) {
        console.log(ex);
      }
    })();
  }, [ipfsHash]);

  if (!ipfsHash || !wallets[0] || !contractAddress) {
    return (
      <div>
        Bad request. Please try again. Make sure to have the following query params: ipfsHash, contractAddress, wallet
      </div>
    )
  }

  const loading = !nftMetadata;

  return (
    <section className="text-gray-600 body-font">
      <Header>
      {contractAddress && (
          <div className="bg-gray-100 rounded flex p-4 h-full items-center">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-medium">
              Contract Found: {contractAddress}
            </span>
          </div>
        )}
      </Header>
      <div className="container mx-auto flex px-5 pb-5 flex-col">
        {loading && (<div>
          Loading...
        </div>)}
        {!loading && (<Mint
          nftMetadata={nftMetadata}
          tokenURI={tokenURI}
          wallets={wallets}
          contractAddress={contractAddress as Address}
        />)}
      </div>
   </section>
  )

};

export default MintPage;
