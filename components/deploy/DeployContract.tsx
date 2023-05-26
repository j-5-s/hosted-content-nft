import { FormEvent, useState, ChangeEvent } from "react";
import { contractText } from "./contract-text";
import { useWalletClient, useWaitForTransaction } from "wagmi";
import NFTContract from "../mint/contract.json";

const trimHash = (
  hash: `0x${string}` | null,
  prefix: number,
  suffix: number
) => {
  if (!hash) return "";
  return (
    hash.substring(0, prefix) + "..." + hash.substring(hash.length - suffix)
  );
};
type ContractArguments = {
  name: string;
  token: string;
};

export const DeployContract = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>();
  const [isDeployingContract, setIsDeployingContract] = useState(false);
  const [contract, setContract] = useState<ContractArguments>({
    name: "",
    token: "",
  });

  const handleInputField = (key: "name" | "token") => {
    return (evt: ChangeEvent<HTMLInputElement>) => {
      setContract((prev) => ({
        ...prev,
        [key]: evt?.target.value,
      }));
    };
  };

  const { data: walletClient } = useWalletClient();
  const { data, isLoading } = useWaitForTransaction({
    hash,
  });
  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (contract.name && contract.token) {
      try {
        setError(null);
        setIsDeployingContract(true);
        const hash = await walletClient?.deployContract({
          abi: NFTContract.abi,
          account: walletClient.account,
          args: [contract.name, contract.token],
          bytecode: NFTContract.bytecode as `0x${string}`,
        });

        setHash(hash);
        setIsDeployingContract(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (ex: any) {
        setError(ex.message);
        console.error(ex);
        setIsDeployingContract(false);
      }
    }
  };
  const testNet =
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? "sepolia." : "";
  return (
    <div className="py-6">
      <form
        className="bg-gray-100 rounded-lg flex p-8 flex-col w-full "
        onSubmit={handleSubmit}
      >
        {/* <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2> */}
        <div className="relative mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            Name
          </label>
          <input
            required
            onChange={handleInputField("name")}
            value={contract.name}
            type="text"
            id="name"
            name="name"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is often referred to as the Collection Name.
          </p>
        </div>
        <div className="relative mb-4">
          <label
            htmlFor="full-name"
            className="leading-7 text-sm text-gray-600"
          >
            Token
          </label>
          <input
            required
            onChange={handleInputField("token")}
            value={contract.token}
            type="text"
            id="full-name"
            name="full-name"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label
            htmlFor="full-name"
            className="leading-7 text-sm text-gray-600"
          >
            Contract Template
          </label>

          <textarea
            rows={30}
            id="full-name"
            name="full-name"
            className="opacity-50 leading-4 text-xs w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out"
            value={contractText}
            disabled
          />
        </div>
        {error && (
          <div className="bg-gray-100 rounded flex p-4 h-full items-center mb-2 border border-red-500 overflow-scroll">
            <span className="title-font font-medium">{error}</span>
          </div>
        )}
        {data && (
          <div className="bg-gray-100 rounded flex p-4 h-full items-center mt-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
            <span className="title-font font-medium">
              Successfully deployed your NFT contract! Transaction{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://${testNet}etherscan.io/tx/${data?.transactionHash}`}
                className="text-blue-500 underline"
              >
                {trimHash(data?.transactionHash, 4, 4)}
              </a>
              . Contract{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://${testNet}etherscan.io/tx/${data?.transactionHash}`}
                className="text-blue-500 underline"
              >
                {trimHash(data?.contractAddress, 4, 4)}
              </a>
            </span>
          </div>
        )}
        <button
          disabled={isDeployingContract || isLoading}
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-25"
        >
          {isDeployingContract || isLoading ? "Deploying..." : "Deploy"}
        </button>
        <p className="text-xs text-gray-500 mt-3">
          Changes to contract are not allowed as pre-compiled ABI is being
          deployed.
        </p>
      </form>
    </div>
  );
};
