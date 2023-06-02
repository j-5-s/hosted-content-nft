import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import type { ChainData } from "../../hooks/useContract";
import cloneableContract from "../mint/CloneableContract.json";
import { formatEther } from "viem";

type Props = {
  chainData?: ChainData;
  address: `0x${string}`;
};

export const EditContract = ({ chainData, address }: Props) => {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    description: chainData?.description,
    defaultClonePrice: chainData?.defaultClonePrice,
  });

  const { data, isLoading, write } = useContractWrite({
    address,
    abi: cloneableContract.abi,
    functionName: "setDescription",
    args: [fields.description],
  });

  const { isLoading: isLoadingTx, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const handleChange = (field: string) => {
    return (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({
        ...prev,
        [field]: evt.target.value,
      }));
    };
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    //
    write?.();
    // setEditing(false);
  };
  useEffect(() => {
    if (!isLoadingTx && isSuccessTx) {
      setEditing(false);
    }
  }, [isLoadingTx, isSuccessTx]);
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 bg-white rounded border border-gray-200 m-4 shadow flex flex-col justify-between"
    >
      <div>
        <div className="px-2 py-3 mb-2 justify-between border-b border-gray-200 w-full items-center">
          <div className="  font-bold">
            {chainData?.name} ({chainData?.symbol})
          </div>
          <div></div>
        </div>
        <div className="flex p-2 border-b border-gray-100 mb-2 mx-2 items-center">
          <div className="tracking-widest title-font">Default Clone Price</div>
          <div className="flex-1 ml-2">
            {!editing && formatEther(BigInt(fields.defaultClonePrice || 0))}
            {editing && (
              <input
                type="text"
                value={fields.defaultClonePrice}
                onChange={handleChange("defaultClonePrice")}
                className="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 px-2 w-full leading-6 transition-colors duration-200 ease-in-out"
              />
            )}
          </div>
        </div>
        <div className="flex p-2 flex-col border-b border-gray-100 mb-2 mx-2">
          <div className=" tracking-widest title-font mb-2">Description</div>
          <div className="">
            {!editing && fields.description}
            {editing && (
              <textarea
                value={fields.description}
                onChange={handleChange("description")}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700  px-2 leading-6 transition-colors duration-200 ease-in-out"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex border-t w-full px-4 py-2">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="w-24 text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
          >
            Edit
          </button>
        )}
        {editing && (
          <button
            type="submit"
            className="min-w-24 mr-2 flex items-center text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg disabled:opacity-25"
          >
            Save {(isLoading || isLoadingTx) && "..."}
          </button>
        )}
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="min-w-24 flex items-center text-blue-500 border-blue-500  border py-2 px-6 focus:outline-none hover:bg-gray-100 rounded text-lg disabled:opacity-25"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
