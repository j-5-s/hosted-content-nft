import { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import contract from "../components/mint/CloneableContract.json";
import { fetchData } from "../components/util";
import { NFTMetadata } from "../types";

type Props = {
  contractAddress: `0x${string}`;
  tokenId: bigint;
};

type FetchState = {
  data: NFTMetadata | null;
  error?: string | null;
  loading: boolean;
  tokenURI: string | null;
};
export const useFetchNFT = (props: Props) => {
  const { tokenId, contractAddress } = props;

  const [state, setState] = useState<FetchState>({
    loading: false,
    data: null,
    tokenURI: null,
    error: null,
  });

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contract.abi,
    args: [tokenId],
    functionName: "tokenURI",
    staleTime: 1000 * 60 * 5,
    enabled: !!(contractAddress && tokenId),
  });

  const contractInput = {
    address: contractAddress,
    abi: contract.abi,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const readsResponse = useContractReads({
    enabled: !!contractAddress,
    contracts: [
      {
        ...contractInput,
        functionName: "getTokenCreator",
        args: [tokenId],
      },
      {
        ...contractInput,
        functionName: "isClone",
        args: [tokenId],
      },
    ],
  });

  const chainData = {
    creator: "",
    isClone: false,
  };

  if (readsResponse.data) {
    chainData.creator = readsResponse.data[0].result as unknown as string;
    chainData.isClone = readsResponse.data[1].result as unknown as boolean;
  }

  useEffect(() => {
    if (data && typeof data === "string") {
      (async () => {
        setState((existing) => ({
          ...existing,
          loading: true,
        }));
        const metadata = await fetchData(data);
        setState({
          data: metadata,
          tokenURI: data,
          loading: false,
          error: null,
        });
      })();
    }
  }, [data]);
  return {
    ...state,
    chainData,
    loading: state.loading || isLoading,
  };
};
