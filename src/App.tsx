import React from "react";
import TaskBoard from "./components/board2";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <TaskBoard />
    </div>
  );
};

export default App;
