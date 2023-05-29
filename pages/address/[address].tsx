import { ChangeEvent, useEffect } from "react";
import type { NextPage } from "next";
import { useSwitchNetwork } from "wagmi";
import { useRouter } from "next/router";
import { Header } from "../../components/header";
import { Collection } from "../../components/collection";
import { getFirstQueryParam } from "../../components/util";

const Search: NextPage = () => {
  const router = useRouter();
  const search = getFirstQueryParam("address");
  const networkParam = getFirstQueryParam("network");
  const { switchNetwork, chains } = useSwitchNetwork();
  const updateSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    router.push(`/address/${value}`);
  };
  useEffect(() => {
    if (networkParam && switchNetwork) {
      const chain = chains.find((c) => c.network === networkParam);
      if (chain) {
        switchNetwork(chain.id);
      }
    }
  }, [networkParam, chains, switchNetwork]);
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
        {search && <Collection address={search} />}
      </div>
    </section>
  );
};

export default Search;
