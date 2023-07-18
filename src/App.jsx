import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "./contexts/AppContext";
import Canvas from "./Canvas";

function App() {

  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Canvas />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
