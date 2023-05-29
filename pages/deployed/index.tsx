import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import type { NextPage } from "next";
import { Header } from "../../components/header";
import { MetadataInstructions } from "../../components/deploy/MetadataInstructions";
import { getFirstQueryParam } from "../../components/util";
import { AddressString } from "../../types";
import { useContract } from "../../hooks/useContract";
import { db } from "../../db/db";

const DeployedPage: NextPage = () => {
  const { isConnected, address: userAddress } = useAccount();
  const network = useNetwork();
  const transactionHash = getFirstQueryParam(
    "transactionHash"
  ) as AddressString;
  const contractAddress = getFirstQueryParam(
    "contractAddress"
  ) as AddressString;

  const { data } = useContract({
    address: contractAddress,
  });

  useEffect(() => {
    (async () => {
      if (
        data?.name &&
        isConnected &&
        contractAddress &&
        userAddress &&
        transactionHash &&
        network?.chain?.network
      ) {
        try {
          const existingContract = await db.contracts.get({
            address: contractAddress,
          });
          if (!existingContract) {
            const id = await db.contracts.add({
              address: contractAddress as string,
              user: userAddress as string,
              txHash: transactionHash as string,
              name: data.name,
              network: network.chain.network,
              symbol: data.symbol,
              creator: data.creator,
              owner: data.owner,
              description: data.description,
              createdAt: data.createdAt,
            });
            console.log(id, "added to db");
          } else {
            // handle case where contract already exists in the DB
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    })();
  }, [
    data,
    isConnected,
    userAddress,
    contractAddress,
    transactionHash,
    network?.chain?.network,
  ]);
  return (
    <section className="text-gray-600 body-font flex flex-col min-h-screen">
      <Header step={3}>
        <h1>Install Metadata</h1>
      </Header>

      <div className="bg-gray-100 flex-1">
        <MetadataInstructions
          transactionHash={transactionHash}
          contractAddress={contractAddress}
        />
      </div>
    </section>
  );
};

export default DeployedPage;
