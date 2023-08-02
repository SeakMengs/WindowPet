import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Canvas from "./Canvas";
import Setting from "./Setting";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
