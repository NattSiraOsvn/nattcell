import React from "react";

const AppShell: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-stone-50 text-stone-900">
      {children}
    </div>
  );
};

export default AppShell;

