import { ChangeEvent } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "../../components/header";
import { Collection } from "../../components/collection";
import { getFirstQueryParam } from "../../components/util";

const Search: NextPage = () => {
  const router = useRouter();
  const search = getFirstQueryParam("q");
  const updateSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    router.push(`/search?q=${value}`);
  };
  return (
    <section className="text-gray-600 body-fon">
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
      <div className="bg-gray-100">
        {!search && <div>todo default search</div>}
        {search && <Collection address={search} />}
      </div>
    </section>
  );
};

export default Search;
