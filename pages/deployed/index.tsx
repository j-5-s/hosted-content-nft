import { useEffect } from "react";
import { useAccount } from "wagmi";
import type { NextPage } from "next";
import { Header } from "../../components/header";
import { MetadataInstructions } from "../../components/deploy/MetadataInstructions";
import { getFirstQueryParam } from "../../components/util";
import { AddressString } from "../../types";
import { useContract } from "../../hooks/useContract";
import { db } from "../../db/db";

const DeployedPage: NextPage = () => {
  const { isConnected, address: userAddress } = useAccount();
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
        data &&
        isConnected &&
        contractAddress &&
        userAddress &&
        transactionHash
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
              symbol: data.symbol,
              creator: data.creator,
              owner: data.owner,
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
  }, [data, isConnected, userAddress, contractAddress, transactionHash]);
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
