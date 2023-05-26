import { FormEvent, useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { contractText } from "./contract-text";
import { useWalletClient, useWaitForTransaction } from "wagmi";
import NFTContract from "../mint/contract.json";

type ContractArguments = {
  name: string;
  token: string;
};

export const DeployContract = () => {
  const router = useRouter();
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
  useEffect(() => {
    if (data?.contractAddress && data?.transactionHash) {
      router.push(
        `/deployed?transactionHash=${data?.transactionHash}&contractAddress=${data?.contractAddress}`
      );
    }
  }, [data?.contractAddress, data?.transactionHash]);
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
