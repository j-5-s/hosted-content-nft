import { ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "../components/header";
import { getFirstQueryParam } from "../components/util";
import { db } from "../db/db";
import { ContractItem } from "../components/collection/contract/ContractItem";
import { SearchField } from "../components/collection/SearchField";

const Home: NextPage = () => {
  const search = getFirstQueryParam("search");
  const networkParam = getFirstQueryParam("network");
  const contracts = useLiveQuery(() => db.contracts.toArray());

  return (
    <section className="text-gray-600 body-font flex flex-col min-h-screen">
      <Header>
        <SearchField defaultValue={search} network={networkParam} />
      </Header>
      <div className="bg-gray-100 flex-1">
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container py-24 mx-auto">
            <div className="-my-8 divide-y-2 divide-gray-200">
              {contracts?.map((contract, index) => (
                <ContractItem key={index} contract={contract} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
