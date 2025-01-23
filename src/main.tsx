import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Task from "./components/Task.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:task" element={<Task />} />
      </Routes>
    </Router>
  </StrictMode>
);
