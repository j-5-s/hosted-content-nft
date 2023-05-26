import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractJson from "./CloneableContract.json";
import type { Address } from "../../types";

type MintButtonProps = {
  contractAddress: Address;
  recipientAddress: Address;
  tokenURI: string;
  disabled: boolean;
};
export const MintButton = (props: MintButtonProps) => {
  const { disabled, contractAddress, recipientAddress, tokenURI } = props;

  const testNet =
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? "sepolia." : "";

  const {
    config,
    // error: prepareError,
    // isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: "mintNFT",
    args: [recipientAddress, tokenURI],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const mintNFT = () => {
    write?.();
  };

  return (
    <div className="w-full flex flex-col">
      {isError && (
        <div className="bg-gray-100 rounded flex p-4 h-full items-center mb-2 border border-red-500 overflow-scroll">
          <span className="title-font font-medium">{error?.message}</span>
        </div>
      )}
      <button
        disabled={disabled || isLoading || !contractAddress}
        onClick={mintNFT}
        className="flex-1 text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
      >
        {isLoading ? "Minting..." : "Mint"}
      </button>
      {isSuccess && (
        <div className="bg-gray-100 rounded flex p-4 h-full items-center mt-2">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
            viewBox="0 0 24 24"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span className="title-font font-medium">
            Successfully minted your NFT!{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://${testNet}etherscan.io/tx/${data?.hash}`}
              className="text-blue-500 underline"
            >
              Etherscan
            </a>
          </span>
        </div>
      )}
    </div>
  );
};
