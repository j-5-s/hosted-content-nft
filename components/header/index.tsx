import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
type HeaderProps = {
  children?: React.ReactNode;
};
export const Header = ({ children }: HeaderProps) => {
  return (
    <div className="container mx-auto flex py-5 flex-col border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 mr-5">{children}</div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
