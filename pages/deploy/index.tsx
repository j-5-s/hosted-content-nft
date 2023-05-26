import type { NextPage } from "next";
import { Header } from "../../components/header";
import { DeployContract } from "../../components/deploy/DeployContract";

const DeployPage: NextPage = () => {
  return (
    <section className="text-gray-600 body-font">
      <Header>
        <h1 className="title-font sm:text-4xl text-3x font-medium text-gray-900">
          Deploy New Contract
        </h1>
      </Header>
      <div className="container mx-auto flex pb-5 flex-col">
        <DeployContract />
      </div>
    </section>
  );
};

export default DeployPage;
