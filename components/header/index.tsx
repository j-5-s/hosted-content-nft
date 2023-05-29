import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Progress } from "../progress/Progress";
type HeaderProps = {
  children?: React.ReactNode;
  step?: number;
};
export const Header = ({ children, step }: HeaderProps) => {
  return (
    <div className=" sticky top-0 bg-white z-10 border-b-1 border-gray-100">
      <div className="container mx-auto flex pt-5 flex-col">
        <div className="container mx-auto flex items-center justify-between mb-2">
          <div className="w-12 h-12 flex items-center justify-center p-1 mr-2">
            <a href="/" title="Home">
              <Image src="/rico.png" width={40} height={40} />
            </a>
          </div>
          <div className="flex-1 mr-5 title-font sm:text-2xl text-lg font-medium text-gray-900">
            {children}
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
        {step && (
          <div className="mt- border-t border-gray-200 ">
            <Progress step={step} />
          </div>
        )}
      </div>
    </div>
  );
};
