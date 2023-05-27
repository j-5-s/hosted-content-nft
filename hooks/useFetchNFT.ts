import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
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
};
export const useFetchNFT = (props: Props) => {
  const { tokenId, contractAddress } = props;

  const [state, setState] = useState<FetchState>({
    loading: false,
    data: null,
    error: null,
  });

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: contract.abi,
    args: [tokenId],
    functionName: "tokenURI",
    enabled: !!(contractAddress && tokenId),
  });

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
          loading: false,
          error: null,
        });
      })();
    }
  }, [data]);

  return {
    ...state,
    loading: state.loading || isLoading,
  };
};
