import { useContractRead, useWalletClient, useContractReads } from "wagmi";
import contract from "../mint/CloneableContract.json";
import { NFTCard } from "./NFTCard";
type CollectionProps = {
  address?: string;
};
type ContractData = {
  data: bigint[] | undefined;
  isLoading: boolean;
  isError: boolean;
};
export const Collection = (props: CollectionProps) => {
  const { address } = props;
  const { data: walletClient } = useWalletClient();

  const { data, isError, isLoading, ...args }: ContractData = useContractRead({
    address: address as `0x${string}`,
    abi: contract.abi,
    args: [walletClient?.account.address],
    functionName: "getOwnedTokens",
    enabled: !!(address && walletClient?.account.address),
  });

  const { data: name }: { data: string | undefined } = useContractRead({
    address: address as `0x${string}`,
    abi: contract.abi,
    functionName: "name",
    enabled: !!address,
  });

  const { data: symbol }: { data: string | undefined } = useContractRead({
    address: address as `0x${string}`,
    abi: contract.abi,
    functionName: "symbol",
    enabled: !!address,
  });

  return (
    <div className="container py-24 mx-auto">
      <div className="flex flex-col text-center w-full mb-20">
        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          {name}
        </h1>
        <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
          {symbol}
        </h2>
      </div>
      <div className="flex flex-wrap -m-4">
        {data?.map((tokenId) => (
          <NFTCard
            key={tokenId.toString()}
            tokenId={tokenId}
            contractAddress={address as `0x${string}`}
          />
        ))}
      </div>
    </div>
  );
};
