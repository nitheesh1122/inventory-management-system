import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Inventory from "./components/Inventory/InventoryList";
import Account from "./components/Account/AccountManagement";
import Tools from "./components/Tools/Tools";
import Billing from "./components/Billing/Billing";
import WorkerDashboard from "./components/Worker/WorkerDashboard";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated, getUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated() ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex" }}>
                <Sidebar user={user} />
                <div style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/worker" element={<WorkerDashboard />} />
                    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
