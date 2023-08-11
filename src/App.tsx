import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
const Canvas = React.lazy(() => import("./Canvas"));
const Setting = React.lazy(() => import("./Setting"));

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
