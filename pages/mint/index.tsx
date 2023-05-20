import type { NextPage, GetServerSideProps } from 'next';
import { Mint } from '../../components/Mint'; 
import Head from 'next/head';
import { NFTMetadata, Address } from '../../types';

type PageProps = {
  // Define the shape of the props returned by getServerSideProps
  // based on your specific data requirements
  ipfsHash: string;
  contractAddress: string;
  nftMetadata: NFTMetadata
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
    wallet = [wallet];
  }

  const nftMetadata = await fetchDataFromPinata(ipfsHash);
  
  return {
    props: {
      ipfsHash,
      nftMetadata,
      contractAddress,
      wallets: wallet.map((w) => {
        const [name, content] = w.split('::');
        return {name, content};
      })
    }
  };
}

const MintPage: NextPage<PageProps> = ({ ipfsHash, nftMetadata, wallets, contractAddress }) => {
  const tokenURI = `ifps://${ipfsHash}`;
  return (
   <div>
      <Mint
        nftMetadata={nftMetadata}
        tokenURI={tokenURI}
        wallets={wallets}
        contractAddress={contractAddress as Address}
      />
   </div>
  );
};

export default MintPage;
