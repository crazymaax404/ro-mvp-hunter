import { Route, Routes } from "react-router-dom";

import { MvpStorageProvider } from "./hooks";

import IndexPage from "@/pages";

function App() {
  return (
    <MvpStorageProvider>
      <Routes>
        <Route element={<IndexPage />} path="/" />
      </Routes>
    </MvpStorageProvider>
  );
}

export default App;
