import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
type HeaderProps = {
  children?: React.ReactNode;
};
export const Header = ({ children }: HeaderProps) => {
  return (
    <div className="container mx-auto px-5 flex py-5 flex-col">
      <div className="container mx-auto flex items-center justify-between ">
        <div className="flex-1 mr-5">{children}</div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
