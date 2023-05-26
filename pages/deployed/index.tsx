import type { NextPage } from "next";
import { Header } from "../../components/header";
import { MetadataInstructions } from "../../components/deploy/MetadataInstructions";
import { getFirstQueryParam } from "../../components/util";
import { AddressString } from "../../types";

const DeployedPage: NextPage = () => {
  const transactionHash = getFirstQueryParam(
    "transactionHash"
  ) as AddressString;
  const contractAddress = getFirstQueryParam(
    "contractAddress"
  ) as AddressString;
  return (
    <section className="text-gray-600 body-font">
      <Header step={3}>
        <h1 className="title-font sm:text-4xl text-3x font-medium text-gray-900">
          Install Metadata
        </h1>
      </Header>

      <div className="container mx-auto flex pb-5 flex-col">
        <MetadataInstructions
          transactionHash={transactionHash}
          contractAddress={contractAddress}
        />
      </div>
    </section>
  );
};

export default DeployedPage;
