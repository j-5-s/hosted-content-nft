import { useState } from "react";
import { useContractRead, useWalletClient, useNetwork } from "wagmi";
import contract from "../mint/CloneableContract.json";
import { NFTCard } from "./NFTCard";
import { getUrl } from "../util";
import { Copy } from "../icons/copy";
import { useContract } from "../../hooks/useContract";
import { CollectionTable } from "./CollectionTable";
import { CollectionTableRow } from "./CollectionTable/CollectionTableRow";
import { Tabs, Tab, TabHeader, TabBody, TabContent } from "../tabs";
import { FullPageMessaging } from "../FullPageMessaging";
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
  const [myItemsFilter, setMyItemsFilter] = useState(false);

  const { data }: ContractData = useContractRead({
    address: address as `0x${string}`,
    abi: contract.abi,
    args: myItemsFilter ? [walletClient?.account.address] : [],
    functionName: myItemsFilter ? "getOwnedTokens" : "getAllMintedTokens",
    enabled: myItemsFilter
      ? !!(address && walletClient?.account.address)
      : !!address,
  });

  console.log(data);
  const filterAllItems = (value: boolean) => {
    setMyItemsFilter(value);
  };

  const {
    data: contractData,
    error,
    isLoading,
  } = useContract({
    address: address as `0x${string}`,
  });

  const contractLink = getUrl({
    address: contractData?.creator,
    network: network?.chain?.network,
  });

  const addressLink = getUrl({
    address: address,
    network: network?.chain?.network,
  });
  //0xa578f91257d06f83d373f717dfb7ddfb335317d6

  if (error) {
    return <FullPageMessaging error={error} />;
  }

  if (isLoading) {
    return <FullPageMessaging loading />;
  }

  const ts = contractData?.createdAt
    ? new Date(contractData?.createdAt).toLocaleString()
    : "";

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
        <div className="flex-1 bg-white rounded border border-gray-200 m-4 shadow">
          <div className="border-b border-gray-200 px-2 py-3 font-bold text-sm">
            {contractData?.name} ({contractData?.symbol})
          </div>
          <div className="p-2 text-sm flex">
            <p>{contractData?.description}</p>
          </div>
        </div>
        <div className="flex-1 bg-white rounded border border-gray-200 m-4 shadow">
          <div className="border-b border-gray-200 px-2 py-3 font-bold text-sm">
            More Info
          </div>
          <div className="py-4 px-2 text-sm">
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">
                Contract Creator
              </div>
              <div className="w-3/4">
                <a
                  href={contractLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline text-xs"
                >
                  {contractData?.creator}
                </a>
              </div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">
                Contract Address
              </div>
              <div className="w-3/4">
                <a
                  href={addressLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline text-xs"
                >
                  {address}
                </a>
              </div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">Balance</div>
              <div className="w-3/4">{contractData?.balanceOf}</div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">Tokens</div>
              <div className="w-3/4">{contractData?.totalTokens}</div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">Created At</div>
              <div className="w-3/4">{ts}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex -m-4">
        <Tabs
          defaultTab="list"
          className="flex-1 bg-white rounded border border-gray-200 m-4 pb-4 shadow"
        >
          <TabHeader
            actions={() => {
              return (
                <div className="flex items-center">
                  <input
                    onChange={(evt) => filterAllItems(evt.target.checked)}
                    type="checkbox"
                    id="all-contracts"
                    className="mr-1"
                  />
                  <label htmlFor="all-contracts" className="text-xs">
                    My Tokens
                  </label>
                </div>
              );
            }}
          >
            <Tab id="list">Token List</Tab>
            <Tab id="cards">Token Cards</Tab>
          </TabHeader>
          <TabContent className="text-sm px-3">
            <TabBody id="list">
              <CollectionTable
                tokens={data}
                renderRow={(tokenId) => (
                  <CollectionTableRow
                    key={tokenId.toString()}
                    contractAddress={address as `0x${string}`}
                    tokenId={tokenId}
                    network={network?.chain?.network}
                  />
                )}
              />
            </TabBody>
            <TabBody id="cards">
              <div className="flex flex-wrap -mx-4 -mt-4">
                {data?.map((tokenId) => (
                  <NFTCard
                    key={tokenId.toString()}
                    tokenId={tokenId}
                    contractAddress={address as `0x${string}`}
                  />
                ))}
              </div>
            </TabBody>
          </TabContent>
        </Tabs>
      </div>
    </div>
  );
};
