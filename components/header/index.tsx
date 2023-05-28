import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Progress } from "../progress/Progress";
type HeaderProps = {
  children?: React.ReactNode;
  step?: number;
};
export const Header = ({ children, step }: HeaderProps) => {
  return (
    <div className=" mx-auto flex pt-5 pb-2 flex-col sticky top-0 bg-white z-10">
      <div className="container mx-auto flex items-center justify-between mb-2">
        <div className="flex-1 mr-5">{children}</div>
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
  );
};
