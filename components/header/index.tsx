import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Progress } from "../progress/Progress";
type HeaderProps = {
  children?: React.ReactNode;
  step: number;
};
export const Header = ({ children, step }: HeaderProps) => {
  return (
    <div className="container mx-auto flex pt-5 flex-col sticky top-0 bg-white z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 mr-5">{children}</div>
        <div>
          <ConnectButton />
        </div>
      </div>
      <div className="mt-2 border-t border-gray-200 ">
        <Progress step={step} />
      </div>
    </div>
  );
};
