import { ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "../components/header";
import { getFirstQueryParam } from "../components/util";
import { db } from "../db/db";
import { ContractItem } from "../components/collection/contract/ContractItem";

const Home: NextPage = () => {
  const router = useRouter();
  const search = getFirstQueryParam("search");
  const updateSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    router.push(`/search?q=${value}`);
  };
  const contracts = useLiveQuery(() => db.contracts.toArray());

  return (
    <section className="text-gray-600 body-font flex flex-col min-h-screen">
      <Header>
        <div className="relative flex-grow w-full">
          <input
            onChange={updateSearch}
            value={search}
            type="text"
            id="search"
            name="search"
            placeholder="tx or address"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
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
