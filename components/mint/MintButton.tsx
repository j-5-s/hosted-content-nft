import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useContractRead,
  useAccount,
} from "wagmi";
import { formatEther } from "viem";
import { useRouter } from "next/router";
import cloneableContract from "./CloneableContract.json";
import type { Address } from "../../types";
import { getUrl } from "../util";
import { useEffect, useState } from "react";
import { ChainData } from "../../hooks/useContract";

type MintButtonProps = {
  contractAddress: Address;
  tokenURI: string;
  disabled: boolean;
  url: string;
  chainData?: ChainData;
};

type PrepareCause = {
  name: string;
  reason: string;
  shortMessage: string;
};
const ONLY_OWNER_MESSAGE = "Only the contract owner may call the mint function";
const getErrorMessage = (error?: PrepareCause) => {
  if (error?.name === "ContractFunctionRevertedError") {
    if (error.reason === "Ownable: caller is not the owner") {
      return ONLY_OWNER_MESSAGE;
    }
    return error.reason;
  }

  return null;
};
export const MintButton = (props: MintButtonProps) => {
  const { disabled, contractAddress, tokenURI, url, chainData } = props;
  const router = useRouter();
  const network = useNetwork();
  const account = useAccount();

  const [tokenId, setTokenId] = useState<number | undefined>();
  const clone = chainData?.owner === account.address;
  const defaultClonePrice = chainData?.defaultClonePrice || 0;
  const [manualClonePrice, setManualClonePrice] = useState<
    number | undefined
  >();
  const clonePrice =
    typeof manualClonePrice !== "undefined"
      ? manualClonePrice
      : defaultClonePrice;
  const opts = {
    address: contractAddress,
    abi: cloneableContract.abi,
    functionName: clone ? "mintClone" : "mintNFT",
    args: clone ? [tokenId, tokenURI] : [tokenURI, url],
    enabled: clone ? !!tokenId : true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: undefined as any,
  };

  if (clone) {
    opts.value = BigInt(clonePrice);
  }
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite(opts);

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const mintNFT = () => {
    write?.();
  };

  const tokenResponse = useContractRead({
    abi: cloneableContract.abi,
    address: contractAddress,
    functionName: "getTokenIdByUrl",
    args: [url],
    enabled: !!(url && clone),
  });

  useEffect(() => {
    if (tokenResponse.data) {
      setTokenId(Number(tokenResponse.data));
    } else {
      setTokenId(undefined);
    }
  }, [tokenResponse.data]);

  const tokenPrice = useContractRead({
    abi: cloneableContract.abi,
    address: contractAddress,
    functionName: "getClonePrice",
    args: [`${tokenId}`],
    enabled: !!(tokenId && clone),
  });

  const hasClonePrice = useContractRead({
    abi: cloneableContract.abi,
    address: contractAddress,
    functionName: "getHasClonePrice",
    args: [`${tokenId}`],
    enabled: !!(tokenId && clone),
  });

  useEffect(() => {
    if (hasClonePrice.data) {
      setManualClonePrice(Number(tokenPrice.data));
    }
  }, [tokenPrice.data, hasClonePrice.data]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/address/${contractAddress}`);
    }
  }, [isSuccess]);

  const prepareErrorMessage = getErrorMessage(
    prepareError?.cause as PrepareCause
  );
  console.log(clone, tokenId);
  let altError = "";
  if (clone && !tokenId) {
    altError = "Token does not exist to clone";
  }

  return (
    <div className="w-full flex flex-col">
      {(isError || prepareErrorMessage || altError) && (
        <div className="bg-gray-100 rounded flex p-4 h-full items-center mb-2 border border-red-200 overflow-scroll text-xs">
          <span className="title-font font-medium">
            {error?.message || prepareErrorMessage || altError}
          </span>
        </div>
      )}
      <button
        disabled={
          disabled ||
          isLoading ||
          !!altError ||
          !contractAddress ||
          isPrepareError ||
          !!data?.hash
        }
        onClick={mintNFT}
        className="flex-1 text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
      >
        {isLoading ? "Minting..." : "Mint"}
        {clone
          ? ` Clone for ${formatEther(opts.value)} ${
              network.chain?.nativeCurrency.symbol
            }`
          : ""}
      </button>
    </div>
  );
};
