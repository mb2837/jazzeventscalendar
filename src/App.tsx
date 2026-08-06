import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CatalogProvider } from './lib/catalog';
import { AdminGate } from './lib/adminGate';
import PublicDashboard from './pages/PublicDashboard';
import AdminPage from './pages/AdminPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <Routes>
          <Route path="/" element={<PublicDashboard />} />
          <Route
            path="/admin"
            element={
              <AdminGate>
                <AdminPage />
              </AdminGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CatalogProvider>
    </BrowserRouter>
  );
}
