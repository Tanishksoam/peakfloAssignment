import React from "react";
import KanbanBoard from "./components/KanbanBoard";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <KanbanBoard />
    </div>
  );
};

export default App;
