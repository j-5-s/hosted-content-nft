import { MouseEvent, useEffect } from "react";
import { useWaitForTransaction, useContractWrite } from "wagmi";
import contract from "../../mint/CloneableContract.json";
import { useRouter } from "next/router";
type Props = {
  address: `0x${string}`;
  tokenId?: bigint;
};
export const Burn = (props: Props) => {
  const { address, tokenId } = props;
  const router = useRouter();
  const { data, isLoading, write } = useContractWrite({
    address,
    abi: contract.abi,
    functionName: "burnToken",
    args: ["1"],
  });

  const { isLoading: isLoadingTx, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const handleBurn = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    write?.();
  };
  useEffect(() => {
    if (isSuccessTx) {
      router.push(`/address/${address}`);
    }
  }, [isSuccessTx]);
  return (
    <button
      disabled={isLoading || isLoadingTx}
      onClick={handleBurn}
      className="flex mt-4 text-red text-red-500 py-2 px-8 border-red-500 border focus:outline-none hover:bg-red-100 rounded text-lg"
    >
      Burn
    </button>
  );
};
