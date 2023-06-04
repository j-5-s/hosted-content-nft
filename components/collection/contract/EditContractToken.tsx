import { useState, FormEvent, useEffect } from "react";
import { useNetwork, useContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther } from "viem";
import type { TokenChainData } from "../../../hooks/useFetchNFT";
import { Check } from "../../icons/check";
import { XCircle } from "../../icons/x-circle";
import { InputPrice } from "../../form/InputPrice";
import abi from "../../../contracts/cloneable/abi.json";
import { Burn } from "./Burn";
import { NFTMetadata } from "../../../types";
import { Address } from "../../utility/Address";

type EditContractProps = {
  tokenChainData?: TokenChainData | null;
  address: `0x${string}`;
  tokenId?: bigint;
  metadata?: NFTMetadata | null;
};

export const EditContractToken = (props: EditContractProps) => {
  const [editMode, setEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { tokenChainData, address, tokenId, metadata } = props;
  const network = useNetwork();
  const [fields, setFields] = useState({
    clonePrice: tokenChainData?.clonePrice?.toString(),
    hasClonePrice: tokenChainData?.hasClonePrice,
  });

  useEffect(() => {
    setFields({
      clonePrice: tokenChainData?.clonePrice?.toString(),
      hasClonePrice: tokenChainData?.hasClonePrice,
    });
  }, [tokenChainData?.clonePrice]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, write } = useContractWrite({
    address,
    abi,
    functionName: "setClonePrice",
    args: [tokenId, fields.clonePrice],
  });

  const { isLoading: isLoadingTx, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    write?.();
  };

  useEffect(() => {
    if (isSuccessTx && !isLoadingTx) {
      setEditMode(false);
    }
  }, [isSuccessTx, isLoadingTx]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border rounded bg-white p-4 text-xs"
    >
      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
        Owner Management
      </h2>
      <div className="flex p-2 border-b border-gray-100 mb-2">
        <div className="w-1/4 tracking-widest title-font">Token Creator</div>
        <div className="w-3/4">
          <Address link>{tokenChainData?.creator}</Address>
        </div>
      </div>
      <div className="flex p-2 border-b border-gray-100 mb-2">
        <div className="w-1/4 tracking-widest title-font">Token</div>
        <div className="w-3/4 flex">
          <Address link>{tokenChainData?.ownerOf}</Address>
        </div>
      </div>
      <div className="flex p-2 border-b border-gray-100 mb-2">
        <div className="w-1/4 tracking-widest title-font">
          Has Token Clone Price Set
        </div>
        <div className="w-3/4">
          <div className="flex items-start justify-start -mt-1 ">
            {fields.hasClonePrice && <Check />}
            {!fields.hasClonePrice && <XCircle />}
          </div>
        </div>
      </div>
      <div className="flex p-2 border-b border-gray-100 mb-2">
        <div className="w-1/4 tracking-widest title-font">
          Token Clone Price
        </div>
        <div className="w-3/4">
          {editMode && (
            <div>
              <InputPrice
                id="clonePrice"
                name="clonePrice"
                initialValue={formatEther(BigInt(fields?.clonePrice || 0))}
                onChange={(value) => {
                  setFields({
                    hasClonePrice: !!value && value !== "0",

                    clonePrice: value,
                  });
                }}
              />
            </div>
          )}
          {!editMode && typeof tokenChainData?.clonePrice !== "undefined" && (
            <div>
              {formatEther(BigInt(fields.clonePrice || 0))}{" "}
              {mounted && network?.chain?.nativeCurrency?.symbol}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div>
          {editMode && (
            <button
              disabled={isLoading || isLoadingTx}
              onClick={() => setEditMode(true)}
              className="mt-4 mr-2 border-blue-500 text-white bg-blue-500 border py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
            >
              {" "}
              Save
            </button>
          )}
          {editMode && (
            <button
              disabled={isLoading || isLoadingTx}
              onClick={() => setEditMode(false)}
              className="mt-4 mr-2 text-blue-500 border-blue-500 border py-2 px-8 focus:outline-none hover:bg-blue-100 rounded text-lg disabled:opacity-25"
            >
              {" "}
              Cancel
            </button>
          )}
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 mr-2 border-blue-500 text-white bg-blue-500 border py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
            >
              {" "}
              Edit
            </button>
          )}
        </div>

        <Burn tokenId={tokenId} address={address} metadata={metadata} />
      </div>
    </form>
  );
};
