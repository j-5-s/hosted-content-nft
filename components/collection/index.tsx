import { useContractRead, useWalletClient, useNetwork } from "wagmi";
import contract from "../mint/CloneableContract.json";
import { NFTCard } from "./NFTCard";
import { getUrl, trimHash } from "../util";
import { Copy } from "../icons/copy";
import { useContract } from "../../hooks/useContract";
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
  const network = useNetwork();

  const { data }: ContractData = useContractRead({
    address: address as `0x${string}`,
    abi: contract.abi,
    args: [walletClient?.account.address],
    functionName: "getOwnedTokens",
    enabled: !!(address && walletClient?.account.address),
  });

  const { data: contractData } = useContract({
    address: address as `0x${string}`,
  });

  const contractLink = getUrl({
    address: address,
    network: network?.chain?.network,
  });

  // const addressLink = getUrl({
  //   address: address,
  //   network: network?.chain?.network,
  // });

  return (
    <div className="container py-6 mx-auto">
      <div className="flex items-center mb-2">
        <div className="mr-1 h-full">
          Contract{" "}
          <span className="text-gray-500  text-xs mr-2">{address}</span>
        </div>

        <button className="bg-white border rounded-full p-2 hover:bg-gray-100">
          <Copy />
        </button>
      </div>
      <div className="flex -m-4">
        <div className="flex-1 bg-white rounded border border-gray-200 m-4">
          <div className="border-b border-gray-200 px-2 py-3 font-bold text-sm">
            Contract Overview
          </div>
          <div className="py-4 text-sm">
            <div className="flex px-2">
              <div className="w-1/4 tracking-widest title-font">Balance</div>
              <div className="w-3/4">0 Matic</div>
            </div>
            <div className="flex px-2">
              <div className="w-1/4 tracking-widest title-font">
                Num. Contracts
              </div>
              <div className="w-3/4">{contractData?.totalTokens}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded border border-gray-200 m-4">
          <div className="border-b border-gray-200 px-2 py-3 font-bold text-sm">
            More Info
          </div>
          <div className="py-4 px-2 text-sm">
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">
                Contract Creator
              </div>
              <div className="w-3/4">
                <a className="text-blue-500 hover:underline text-xs" href="#">
                  {trimHash("0x66c2801e144a0ba4d7f6aff62f535f312aaf609a", 6, 4)}
                </a>{" "}
                at txn{" "}
                <a className="text-blue-500 hover:underline text-xs" href="#">
                  {trimHash(
                    "0x66c2801e144a0ba4d7f6aff62f535f312aaf609a",
                    10,
                    6
                  )}
                </a>
              </div>
            </div>
            <div className="flex p-2  border-b border-gray-100 mb-2 ">
              <div className="w-1/4 tracking-widest title-font">
                Token Tracker
              </div>
              <div className="w-3/4">
                <a className="text-blue-500 hover:underline text-xs" href="#">
                  {contractData?.name} ({contractData?.symbol})
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-4">
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
