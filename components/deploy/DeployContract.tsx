import { FormEvent, useState, useEffect } from 'react';
import { contractText } from './contract-text';
import { useNetwork, useWalletClient, useWaitForTransaction } from 'wagmi'
import NFTContract from '../mint/contract.json';
export const DeployContract = () => {
  
  const [hash, setHash] = useState<`0x${string}`|undefined>();

  const { data: walletClient, } = useWalletClient();
  const { data, isError, isLoading } = useWaitForTransaction({
    hash,
  });
  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const hash = await walletClient?.deployContract({
      abi: NFTContract.abi,
      account: walletClient.account, 
      args: ['MyNFT', 'MNFT'],
      bytecode: NFTContract.bytecode as `0x${string}`
    })

    setHash(hash);
  };


  return (
    <form className="bg-gray-100 rounded-lg p-8 flex flex-col w-full" onSubmit={handleSubmit}>
      {/* <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2> */}
      <div className="relative mb-4">
        <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
        <input required type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        <p className="text-xs text-gray-500 mt-1">This is often referred to as the Collection Name.</p>
      </div>
      <div className="relative mb-4">
        <label htmlFor="full-name" className="leading-7 text-sm text-gray-600">Token</label>
        <input required type="text" id="full-name" name="full-name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="full-name" className="leading-7 text-sm text-gray-600">Contract Template</label>
        
        <textarea rows={30} id="full-name" name="full-name" className="opacity-50 leading-4 text-xs w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out" value={contractText} disabled />
      </div>
      <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        Deploy
      </button>
      <p className="text-xs text-gray-500 mt-3">Changes to contract are not allowed as pre-compiled code is deployed.</p>
    </form>
  )
}