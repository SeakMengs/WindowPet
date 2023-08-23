import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./Loading";

const Canvas = React.lazy(() => import("./Canvas"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/setting" element={
          <Suspense fallback={<Loading />}>
            <SettingWindow />
            {/* <Loading /> */}
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
