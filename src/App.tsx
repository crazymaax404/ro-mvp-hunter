import { Route, Routes } from "react-router-dom";

import { MvpStorageProvider } from "./hooks";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import IndexPage from "@/pages";
import LoginPage from "@/pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route
        element={
          <ProtectedRoute>
            <MvpStorageProvider>
              <IndexPage />
            </MvpStorageProvider>
          </ProtectedRoute>
        }
        path="/"
      />
    </Routes>
  );
}

export default App;
