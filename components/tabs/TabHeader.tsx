import React from "react";

type TabHeaderProps = {
  children: React.ReactNode;
};
export const TabHeader = (props: TabHeaderProps) => {
  const { children } = props;
  return (
    <div className="flex mb-4">
      {children}
      <div className="flex-1 border-b-2 border-gray-200 "></div>
    </div>
  );
};
