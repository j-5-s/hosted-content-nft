import { useFetchNFT } from "../../../hooks/useFetchNFT";
import { getAttributesAsKeys, getUrl, trimHash } from "../../util";
import type { ChainData } from "../../../hooks/useContract";

type CollectionTableRowProps = {
  tokenId: bigint;
  contractAddress: `0x${string}`;
  network?: string;
  chainData?: ChainData;
};

export const CollectionTableRow = (props: CollectionTableRowProps) => {
  const { tokenId, contractAddress, network, chainData } = props;
  const { data, tokenURI, tokenChainData } = useFetchNFT({
    tokenId,
    contractAddress,
  });

  const tokenURL = getUrl({
    address: contractAddress,
    network,
    token: tokenId.toString(),
  });
  const attributes = getAttributesAsKeys(data);
  const ts = attributes?.Timestamp;
  const date = ts ? new Date(ts).toLocaleString() : "";
  const creatorLink = getUrl({
    address: chainData?.creator,
    network,
  });
  return (
    <tr>
      <td className="px-4 py-3">
        <a
          target="_blank"
          rel="noreferrer"
          href={tokenURL}
          className="text-blue-500 hover:underline"
        >
          [{tokenId.toString()}]
        </a>
      </td>
      <td className="px-4 py-3 max-w-xs overflow-scroll whitespace-nowrap">
        <a
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
          href={attributes?.URL || "#"}
        >
          {attributes?.URL || ""}
        </a>
      </td>
      <td className="px-4 py-3 max-w-xs overflow-scroll whitespace-nowrap">
        {attributes?.Title || ""}
      </td>
      <td className="px-4 py-3 max-w-xs overflow-scroll whitespace-nowrap">
        {date}
      </td>
      <td className="px-4 py-3">
        <a
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          href={tokenURI?.replace("ipfs://", "https://ipfs.io/ipfs/")}
        >
          {trimHash(tokenURI, 11, 4)}
        </a>
      </td>
      <td className="px-4 py-3">
        <a
          href={creatorLink}
          className="text-blue-500 hover:underline"
          rel="noreferrer"
          target="_blank"
        >
          {trimHash(tokenChainData?.creator, 6, 4)}
        </a>
      </td>

      <td className="px-4 py-3">{tokenChainData?.isClone?.toString()}</td>

      <td className="px-4 py-3">
        <a
          href={`/nft/${contractAddress}/${tokenId.toString()}`}
          className="text-blue-500 hover:underline"
        >
          Manage
        </a>
      </td>
    </tr>
  );
};
