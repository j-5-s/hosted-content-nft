import type { NextPage } from "next";

// import { Mint } from "../../components/Mint";
// import Head from "next/head";
import { Header } from "../../components/header";
// import { NFTMetadata, Address, IpfsTokenURI } from "../../types";
import { DeployContract } from "../../components/deploy/DeployContract";

const DeployPage: NextPage = () => {
  return (
    <section className="text-gray-600 body-font">
      <Header>
        <h1 className="text-3xl font-medium title-font mb-4 text-gray-900">
          Deploy New Contract
        </h1>
      </Header>
      <div className="container mx-auto flex px-5 pb-5 flex-col">
        <DeployContract />
      </div>
    </section>
  );
};

export default DeployPage;
