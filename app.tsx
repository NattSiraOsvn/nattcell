import React from "react";
import AppShell from "./src/components/app-shell";

const App: React.FC = () => {
  const activeView = "boot";

  return (
    <AppShell>
      <div className="p-20 text-stone-700 font-mono italic">
        {`>> shard_sync_pending: ${activeView}...`}
      </div>
    </AppShell>
  );
};

export default App;

