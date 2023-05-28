import { useFetchNFT } from "../../../hooks/useFetchNFT";
import { getImageURIFromIPFS, getAttributesAsKeys, getUrl } from "../../util";

type CollectionTableRowProps = {
  tokenId: bigint;
  contractAddress: `0x${string}`;
  network?: string;
};

export const CollectionTableRow = (props: CollectionTableRowProps) => {
  const { tokenId, contractAddress, network } = props;
  const { data, loading, error } = useFetchNFT({
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
      <td className="px-4 py-3">
        <a
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
          href={attributes?.URL || "#"}
        >
          {attributes?.URL || ""}
        </a>
      </td>
      <td className="px-4 py-">{attributes?.Title || ""}</td>
      <td className="px-4 py-3">{date}</td>
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
