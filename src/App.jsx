import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "./contexts/AppContext";
import Pets from "./Pets";

function App() {

  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/pet" element={<Pets />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
