import { useState, useEffect, ReactNode, FormEvent } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import cloneableContract from "./CloneableContract.json";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractReads,
} from "wagmi";
import { Address } from "../../types";
import { ChainData } from "../../hooks/useContract";

export type ContractMeta = {
  data?: {
    tokenId: bigint;
    hasItemizedClonePrice: boolean;
    clonePrice: bigint | undefined;
    isOwner: boolean;
  } | null;
  loading?: boolean;
  error?: Error | null;
};

export type SubmitData = {
  tx?: `0x${string}` | null;
  loading: boolean;
  success: boolean;
  error?: Error | null;
};

type MintFormProps = {
  children: ReactNode | ReactNode[];
  contractAddress: Address;
  tokenURI: string;
  url: string;
  chainData?: ChainData;
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (metadata: ContractMeta) => void;
  onSubmit?: (data: SubmitData) => void;
};

type PrepareCause = {
  name: string;
  reason: string;
  shortMessage: string;
};

const ONLY_OWNER_MESSAGE = "Only the contract owner may call the mint function";

const getErrorMessage = (error?: PrepareCause) => {
  if (error?.name === "ContractFunctionRevertedError") {
    if (error.reason === "Ownable: caller is not the owner") {
      return ONLY_OWNER_MESSAGE;
    }
    return error.reason;
  }

  return null;
};

export const MintForm = (props: MintFormProps) => {
  const {
    contractAddress,
    tokenURI,
    url,
    chainData,
    children,
    className,
    onLoad,
    onError,
    onSubmit,
  } = props;
  const router = useRouter();
  const account = useAccount();
  const [errorMessage, setError] = useState<Error | null>(null);
  const [tokenId, setTokenId] = useState<bigint | undefined>();
  const isOwner = chainData && chainData?.owner === account.address;
  const defaultClonePrice = BigInt(chainData?.defaultClonePrice || 0);

  const [contractMetadata, setContractMetadata] = useState<ContractMeta>({
    data: null,
    loading: true,
    error: null,
  });

  const opts = {
    address: contractAddress,
    abi: cloneableContract.abi,
    functionName: !isOwner ? "mintClone" : "mintNFT",
    args: !isOwner ? [tokenId, tokenURI] : [tokenURI, url],
    enabled: !isOwner ? !!tokenId : true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: undefined as any,
  };

  const clonePrice = contractMetadata?.data?.hasItemizedClonePrice
    ? contractMetadata.data?.clonePrice
    : chainData?.defaultClonePrice;

  if (!isOwner && clonePrice) {
    opts.value = clonePrice;
  }
  const { config, error: prepareError } = usePrepareContractWrite(opts);

  const {
    data,
    error,
    write,
    isLoading: isNotificationLoading,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (onError && (error || prepareError)) {
      onError((error || prepareError) as Error);
    }
  }, [error, prepareError]);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    write?.();
  };

  const contractInput = {
    address: contractAddress,
    abi: cloneableContract.abi,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const getTokenIdByUrlResponse = useContractReads({
    enabled: !!contractAddress,
    contracts: [
      {
        ...contractInput,
        functionName: "getTokenIdByUrl",
        args: [url],
      },
    ],
  });

  const getTokenIdByUrlResponseData = getTokenIdByUrlResponse.data?.[0];
  useEffect(() => {
    const data = getTokenIdByUrlResponseData;
    if (data?.status === "success" && data?.result) {
      setTokenId(data.result as unknown as bigint);
    } else {
      setTokenId(undefined);
    }
  }, [getTokenIdByUrlResponseData]);

  const cloneDataResponse = useContractReads({
    enabled: !!(tokenId && !isOwner),
    contracts: [
      {
        ...contractInput,
        functionName: "getHasClonePrice",
        args: [`${tokenId}`],
      },
      {
        ...contractInput,
        functionName: "getClonePrice",
        args: [`${tokenId}`],
      },
    ],
  });

  useEffect(() => {
    // no cloning functionality for isOwner
    if (isOwner && getTokenIdByUrlResponseData?.status === "success") {
      setContractMetadata({
        data: {
          isOwner,
          tokenId: getTokenIdByUrlResponseData.result as unknown as bigint,
          hasItemizedClonePrice: false,
          clonePrice: undefined,
        },
      });
    }
  }, [getTokenIdByUrlResponseData?.status, isOwner]);

  useEffect(() => {
    if (getTokenIdByUrlResponseData?.status === "success" && !isOwner) {
      const [hasClonePriceData, clonePriceData] = cloneDataResponse.data || [];
      let clonePrice = clonePriceData?.result as unknown as bigint;

      if (typeof clonePrice === "undefined") {
        clonePrice = defaultClonePrice;
      }

      setContractMetadata({
        data: {
          isOwner: !!isOwner,
          tokenId: getTokenIdByUrlResponseData.result as unknown as bigint,
          hasItemizedClonePrice:
            hasClonePriceData?.result as unknown as boolean,
          clonePrice,
        },
        loading: false,
      });
    }
  }, [
    tokenId,
    isOwner,
    cloneDataResponse?.status,
    getTokenIdByUrlResponseData?.result,
    defaultClonePrice,
  ]);

  useEffect(() => {
    if (onSubmit) {
      onSubmit({
        loading: isLoading || isNotificationLoading,
        tx: data?.hash,
        success: isSuccess,
      });
    }
  }, [isSuccess, isLoading, isNotificationLoading, data?.hash]);

  useEffect(() => {
    if (!contractMetadata.loading) {
      if (onLoad) {
        onLoad(contractMetadata);
      }
    }
  }, [contractMetadata]);

  useEffect(() => {
    if (onError && !contractMetadata.loading) {
      if (contractAddress && !isOwner && !tokenId) {
        onError(new Error("Token does not exist to clone. "));
      } else if (!contractAddress) {
        onError(new Error("Please select a contract address"));
      }
    }
  }, [contractAddress, isOwner, tokenId, contractMetadata]);

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
