import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "./contexts/AppContext";
import Canvas from "./Canvas";
import Setting from "./Setting";

function App() {

  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Canvas />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
