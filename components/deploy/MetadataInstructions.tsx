import Image from "next/image";
import { useNetwork } from "wagmi";
import { getUrl } from "../util";
// const trimHash = (
//   hash: `0x${string}` | null,
//   prefix: number,
//   suffix: number
// ) => {
//   if (!hash) return "";
//   return (
//     hash.substring(0, prefix) + "..." + hash.substring(hash.length - suffix)
//   );
// };

type Props = {
  transactionHash?: `0x${string}`;
  contractAddress?: `0x${string}`;
};

export const MetadataInstructions = (props: Props) => {
  const network = useNetwork();
  const { transactionHash, contractAddress } = props;
  const metaTagHtml = `<meta name="nft_contract_address" content="${contractAddress}" />`;
  console.log(network);
  const txLink = getUrl({
    tx: transactionHash,
    network: network?.chain?.network,
  });
  const testNet =
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? "sepolia." : "";
  return (
    <div className="py-6">
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex  md:flex-row flex-col">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <p className="mb-4 leading-relaxed">
              Create a metatag with name attribute of{" "}
              <span className="underline font-bold">nft-contract-address</span>{" "}
              and content attribute{" "}
              <span className="underline font-bold">{contractAddress}</span>.
              The Chrome extension will use this when taking screenshots to mint
              the NFT. Additionally, it will be used to validate your NFT
              ownership.
            </p>
            <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              Example
            </h2>
            <div className="flex justify-center flex-col w-full mb-8">
              <textarea
                value={metaTagHtml}
                disabled
                className="bg-gray-200 rounded p-2 w-full text-xs border border-gray-400"
              />
            </div>

            <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-2">
              Next Steps
            </h2>
            <p className="mb-4">
              After installing the metatag on your website, use the chrome
              extension to capture a screenshot and get to step 4.
            </p>
            <div className="flex items-center w-full flex-col">
              <div className="border border-gray-200 rounded">
                <Image
                  width={500}
                  height={328}
                  className="object-cover object-center  "
                  alt="hero"
                  src="/popup-example.png"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="border border-gray-200 rounded mb-4">
              <Image
                width={500}
                height={375}
                className="object-cover object-center"
                alt="hero"
                src="/metatag.png"
              />
            </div>
            <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-2">
              Save this contract information:
            </h2>
            <div className=" flex border-b border-gray-200 w-full items-center">
              <span className="text-gray-500">Tx</span>
              <span className="ml-auto text-gray-900 text-xs">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={txLink}
                  className="text-blue-500 underline"
                >
                  {transactionHash}
                </a>
              </span>
            </div>
            <div className="flex border-b border-gray-200 py-2 w-full items-center mb-8">
              <span className="text-gray-500">Address</span>
              <span className="ml-auto text-gray-900 text-xs">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://${testNet}etherscan.io/address/${contractAddress}`}
                  className="text-blue-500 underline"
                >
                  {contractAddress}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
