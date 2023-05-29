import { useSwitchNetwork } from "wagmi";
export const Networks = () => {
  const { chains, switchNetwork } = useSwitchNetwork();
  const bindChangeNetwork = (network: number) => {
    return () => {
      if (switchNetwork) {
        switchNetwork(network);
      }
    };
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-red-500">
            Unsupported Network!
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-red-500">
            You are on an unsupported network. Please choose an network below:
          </p>
        </div>
        <div className="flex flex-wrap m-4 text-center w-full justify-center">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={bindChangeNetwork(chain.id)}
              className="p-4 md:w-1/4 sm:w-1/2 w-full"
            >
              <div className="border-2 px-4 py-6 rounded-lg hover:bg-gray-100 border-gray-200">
                <h2 className="title-font font-medium text-3xl text-gray-900">
                  2.7K
                </h2>
                <p className="leading-relaxed">{chain.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
