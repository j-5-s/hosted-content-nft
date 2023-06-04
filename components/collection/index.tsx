import { useState, useEffect } from "react";
import { useContractRead, useWalletClient, useNetwork } from "wagmi";
import abi from "../../contracts/cloneable/abi.json";
import { NFTCard } from "./NFTCard";
import { getUrl } from "../util";
import { Copy } from "../icons/copy";
import { useContract } from "../../hooks/useContract";
import { CollectionTable } from "./CollectionTable";
import { CollectionTableRow } from "./CollectionTable/CollectionTableRow";
import { Tabs, Tab, TabHeader, TabBody, TabContent } from "../tabs";
import { FullPageMessaging } from "../FullPageMessaging";
import { Address } from "../utility/Address";
import { EditContract } from "./EditContract";
type CollectionProps = {
  address: `0x${string}`;
};
type ContractData = {
  data: bigint[] | undefined;
  isLoading: boolean;
  isError: boolean;
};
type SortType = "ascending" | "descending";

export const Collection = (props: CollectionProps) => {
  const { address } = props;
  const { data: walletClient } = useWalletClient();
  const network = useNetwork();

  const [tokenList, setTokenList] = useState<bigint[]>();
  const [sortType, setSortType] = useState<SortType>("descending");
  const [myItemsFilter, setMyItemsFilter] = useState(true);
  // 0 == all, 1 == clone, 2 == original
  const [cloneFilter, setCloneFilter] = useState(0);

  const { data }: ContractData = useContractRead({
    address: address as `0x${string}`,
    abi: abi,
    args: myItemsFilter
      ? [walletClient?.account.address, cloneFilter]
      : [cloneFilter],
    functionName: myItemsFilter ? "getOwnedTokens" : "getAllMintedTokens",
    enabled: myItemsFilter
      ? !!(address && walletClient?.account.address)
      : !!address,
  });

  useEffect(() => {
    if (data) {
      const updatedData = [...data];
      if (sortType === "ascending") {
        updatedData.sort((a, b) => Number(a) - Number(b));
      } else {
        updatedData.sort((a, b) => Number(b) - Number(a));
      }
      setTokenList(updatedData);
    }
  }, [data, sortType]);

  const filterAllItems = (value: boolean) => {
    setMyItemsFilter(value);
  };

  const {
    data: contractData,
    error,
    loading,
  } = useContract({
    address: address as `0x${string}`,
  });

  const contractLink = getUrl({
    address: contractData?.creator,
    network: network?.chain?.network,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(address as string);
  };

  if (error) {
    return <FullPageMessaging error={error} />;
  }

  if (loading) {
    return <FullPageMessaging loading />;
  }

  const ts = contractData?.createdAt
    ? new Date(contractData?.createdAt).toLocaleString()
    : "";

  return (
    <div className="container py-6 mx-auto px-2 md:px-0">
      <div className="flex items-center mb-2">
        <div className="mr-1 h-full flex items-baseline">
          Contract{" "}
          <span className="text-gray-500 ml-2  text-xs mr-2">
            <Address trimPre={6} trimPost={4}>
              {address}
            </Address>
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="bg-white border rounded-full p-2 hover:bg-gray-100"
        >
          <Copy />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 text-xs -m-2 md:-m-4 md:mb-4 ">
        <EditContract chainData={contractData} address={address} />
        <div className="bg-white rounded border border-gray-200 m-2 md:m-4 shadow">
          <div className="border-b border-gray-200 px-2 py-3 font-bold">
            More Info
          </div>
          <div className="py-4 px-2">
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
                  <Address>{contractData?.creator}</Address>
                </a>
              </div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">
                Contract Address
              </div>
              <div className="w-3/4">
                <Address link trimPre={6} trimPost={4}>
                  {address}
                </Address>
              </div>
            </div>
            <div className="flex p-2 border-b border-gray-100 mb-2">
              <div className="w-1/4 tracking-widest title-font">Balance</div>
              <div className="w-3/4">
                {contractData?.balance?.formatted}{" "}
                {contractData?.balance?.symbol}
              </div>
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
      {true && (
        <div className="flex -mx-2 md:-m-4 overflow-scroll">
          <Tabs
            defaultTab="list"
            className="flex-1 bg-white rounded border border-gray-200 m-4 pb-4 shadow"
          >
            <TabHeader
              actions={() => {
                return (
                  <div className="flex">
                    <div className="flex items-center mr-2 text-xs">
                      <select
                        value={sortType}
                        onChange={(evt) =>
                          setSortType(evt.target.value as SortType)
                        }
                      >
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                      </select>
                    </div>
                    <div className="flex items-center mr-2 text-xs">
                      <select
                        value={cloneFilter}
                        onChange={(evt) =>
                          setCloneFilter(parseInt(evt.target.value, 10))
                        }
                      >
                        <option value={0}>All Types</option>
                        <option value={2}>Originals</option>
                        <option value={1}>Clones</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={(evt) => filterAllItems(evt.target.checked)}
                        checked={myItemsFilter}
                        type="checkbox"
                        id="all-contracts"
                        className="mr-1"
                      />
                      <label htmlFor="all-contracts" className="text-xs">
                        My Tokens
                      </label>
                    </div>
                  </div>
                );
              }}
            >
              <Tab id="list">Token List</Tab>
              <Tab id="cards">Token Cards</Tab>
            </TabHeader>
            <TabContent className="text-sm px-3 container overflow-x-scroll pb-6">
              <TabBody id="list">
                <CollectionTable
                  tokens={tokenList}
                  renderRow={(tokenId) => (
                    <CollectionTableRow
                      key={tokenId.toString()}
                      contractAddress={address as `0x${string}`}
                      tokenId={tokenId}
                      chainData={contractData}
                      network={network?.chain?.network}
                    />
                  )}
                />
              </TabBody>
              <TabBody id="cards">
                <div className="columns-3 gap-4">
                  {tokenList?.map((tokenId) => (
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
      )}
    </div>
  );
};
