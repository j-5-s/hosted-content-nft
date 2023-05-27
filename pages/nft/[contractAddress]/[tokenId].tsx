import { useRouter } from "next/router";

export default function NFTPage() {
  const router = useRouter();
  const { contractAddress, tokenId } = router.query;

  // rest of your component logic goes here

  return (
    <div>
      <h1>NFT</h1>
      <p>Contract Address: {contractAddress}</p>
      <p>Token ID: {tokenId}</p>
    </div>
  );
}
