import type { NFTMetadata } from "../../../types";
import { getImageURIFromIPFS, trimHash } from "../../util";
import type { TokenChainData } from "../../../hooks/useFetchNFT";
import { EditContractToken } from "./EditContractToken";
type ContractTokenProps = {
  data?: NFTMetadata | null;
  address: `0x${string}`;
  tokenURI?: string | null;
  tokenId?: bigint;
  tokenChainData?: TokenChainData | null;
};

export const ContractToken = (props: ContractTokenProps) => {
  const { data, tokenChainData, address, tokenId } = props;
  const { creator } = tokenChainData || {};
  const { name, image, description } = data || {};
  const imgUrl = getImageURIFromIPFS(image);

  return (
    <section className="text-gray-600 py-6 body-font container mx-auto">
      <div className="flex items-center mb-2">
        <div className="mr-1 h-full">
          Contract{" "}
          <span className="text-gray-500  text-xs mr-2">{address}</span>/
          <span className="text-gray-500  text-xs mr-2 ml-2">
            {tokenId?.toString()}
          </span>
        </div>
      </div>
      <div className="container mx-auto flex flex-col">
        <div className="">
          <div className="rounded-lg overflow-hidden border">
            {imgUrl && (
              <img
                alt="content"
                className="object-cover object-center h-full w-full"
                src={imgUrl}
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row mt-10 mb-4">
            <div className="sm:w-1/3 text-center sm:py-8 bg-white rounded shadow mr-2 ">
              <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex flex-col items-center text-center justify-center">
                <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                  {trimHash(creator, 6, 4)}
                </h2>
                <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                <p className="text-base">{name}</p>
              </div>
            </div>
            <div className="sm:w-2/3 sm:pl-8 sm:py-8 border-gray-200 mt-4 pt-4 sm:mt-0 text-center sm:text-left bg-white rounded shadow">
              <p className="leading-relaxed text-lg mb-4">{description}</p>
            </div>
          </div>
        </div>
        <EditContractToken
          tokenChainData={tokenChainData}
          address={address}
          tokenId={tokenId}
        />
      </div>
    </section>
  );
};
