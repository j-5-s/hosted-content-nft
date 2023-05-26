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

type Props = {
  transactionHash?: `0x${string}`;
  contractAddress?: `0x${string}`;
};

export const MetadataInstructions = (props: Props) => {
  const { transactionHash, contractAddress } = props;
  return (
    <div>
      Contract deployed {transactionHash}! {contractAddress}
    </div>
  );
};
