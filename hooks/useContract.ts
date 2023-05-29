import { useEffect } from "react";
import { useContractReads, useAccount, useNetwork } from "wagmi";
import { db } from "../db/db";
import contract from "../components/mint/CloneableContract.json";

type Props = {
  address?: `0x${string}` | undefined;
  imports?: boolean;
  transactionHash?: `0x${string}` | undefined;
};

export const useContract = (props: Props) => {
  const { address, transactionHash, imports = false } = props;

  const { isConnected, address: userAddress } = useAccount();
  const network = useNetwork();

  const contractInput = {
    address: address,
    abi: contract.abi,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  let errorMsg;
  const { data, isLoading } = useContractReads({
    enabled: !!address,
    contracts: [
      {
        ...contractInput,
        functionName: "name",
      },
      {
        ...contractInput,
        functionName: "symbol",
      },
      {
        ...contractInput,
        functionName: "owner",
      },
      {
        ...contractInput,
        functionName: "balanceOf",
      },
      {
        ...contractInput,
        functionName: "getTotalMintedTokens",
      },
      {
        ...contractInput,
        functionName: "getContractCreator",
      },
      {
        ...contractInput,
        functionName: "description",
      },
      {
        ...contractInput,
        functionName: "creationTime",
      },
    ],
  });

  const ret = {
    name: "",
    symbol: "",
    owner: "",
    balanceOf: 0,
    totalTokens: "",
    creator: "",
    description: "",
    createdAt: 0,
  };
  if (data) {
    ret.name = data[0].result as unknown as string;
    ret.symbol = data[1].result as unknown as string;
    ret.owner = data[2].result as unknown as string;
    const balance = data[3].result as unknown as number;
    if (balance) {
      ret.balanceOf = balance;
    }
    const totalTokens = data[4].result as unknown as bigint;
    ret.totalTokens = totalTokens?.toString();

    ret.creator = data[5].result as unknown as string;
    ret.description = data[6].result as unknown as string;
    const createdAt = data[7].result as unknown as bigint;
    if (createdAt) {
      ret.createdAt = Number() * 1000;
    }
  }

  // @todo better error handling.
  const status = data?.[0].status as unknown as string;
  if (status === "failure") {
    errorMsg = "Contract not found";
  }

  useEffect(() => {
    (async () => {
      if (
        ret?.name &&
        isConnected &&
        address &&
        userAddress &&
        network?.chain?.network &&
        imports
      ) {
        try {
          const existingContract = await db.contracts.get({
            address,
          });
          if (!existingContract && ret) {
            const id = await db.contracts.add({
              address: address as string,
              user: userAddress as string,
              txHash: transactionHash as string,
              name: ret.name,
              network: network.chain.network,
              symbol: ret.symbol,
              creator: ret.creator,
              owner: ret.owner,
              description: ret.description,
              createdAt: ret.createdAt,
            });
            console.log(ret);
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
    imports,
    address,
    transactionHash,
    network?.chain?.network,
  ]);

  return {
    data: data ? ret : undefined,
    error: errorMsg,
    isLoading,
  };
};
