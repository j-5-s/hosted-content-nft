import { useContractReads } from "wagmi";
import contract from "../components/mint/CloneableContract.json";

type Props = {
  address?: `0x${string}` | undefined;
};

export const useContract = (props: Props) => {
  const { address } = props;
  const contractInput = {
    address: address,
    abi: contract.abi,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  let errorMsg;
  const { data, error, isLoading } = useContractReads({
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
    ],
  });

  const ret = {
    name: "",
    symbol: "",
    owner: "",
    balanceOf: 0,
    totalTokens: "",
    creator: "",
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
  }

  // @todo better error handling.
  const errors = data?.filter((d) => d.status === "failure");
  if (errors?.length === data?.length && data?.length) {
    errorMsg = "Contract not found";
  }

  return {
    data: data ? ret : undefined,
    error: errorMsg,
    isLoading,
  };
};
