import cs from "classnames";
import { getFirstQueryParam } from "../util";

type Props = {
  step: number;
};

export const Progress = (props: Props) => {
  const transactionHash = getFirstQueryParam("transactionHash");
  const contractAddress = getFirstQueryParam("contractAddress");
  const { step } = props;
  let deployed;
  if (step >= 3 && contractAddress) {
    deployed = `/deployed?transactionHash=${transactionHash}&contractAddress=${contractAddress}`;
  }

  return (
    <div className="container mx-auto">
      <div className="flex mx-auto  flex-wrap">
        <a
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
          rel="noreferrer"
          className={cs(
            "sm:px-6 py-3 md:w-1/4 w-full justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none tracking-wider rounded-t",
            {
              "border-indigo-500": step === 1,
              "text-indigo-500": step === 1,
              "bg-gray-100": step === 1,
            }
          )}
        >
          {/* <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg> */}
          1. Install Chrome Extension
        </a>
        <a
          href="/deploy"
          className={cs(
            "sm:px-6 py-3  md:w-1/4 w-full  justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none tracking-wider rounded-t",
            {
              "border-indigo-500": step === 2,
              "text-indigo-500": step === 2,
              "bg-gray-100": step === 2,
            }
          )}
        >
          {/* <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg> */}
          2. Deploy Contract
        </a>
        <a
          href={deployed}
          className={cs(
            "sm:px-6 py-3  md:w-1/4 w-full justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none tracking-wider rounded-t",
            {
              "border-indigo-500": step === 3,
              "text-indigo-500": step === 3,
              "bg-gray-100": step === 3,
              "opacity-50": step < 3,
            }
          )}
        >
          {/* <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="3"></circle>
            <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
          </svg> */}
          3. Install Meta Tag
        </a>
        <a
          className={cs(
            "sm:px-6 py-3  md:w-1/4 w-full justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none tracking-wider rounded-t",
            {
              "border-indigo-500": step === 4,
              "text-indigo-500": step === 4,
              "bg-gray-100": step === 4,
              "opacity-50": step < 4,
            }
          )}
        >
          {/* <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg> */}
          4. Mint NFT with Extension
        </a>
      </div>
    </div>
  );
};
