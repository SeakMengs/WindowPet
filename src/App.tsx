import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./Loading";

const PhaserWrapper = React.lazy(() => import("./PhaserWrapper"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhaserWrapper />} />
        <Route path="/setting" element={
          // <Suspense fallback={<Loading />}>
            <SettingWindow />
          // </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
