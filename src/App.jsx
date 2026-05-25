// App.jsx


import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// ─── Auth Context ────────────────────────────────────────────────────────────
// Stores { token, user: { id, name, role } } in state + localStorage
// Dev B: swap localStorage for httpOnly cookie when backend is ready

export const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('cmms_token');
    const user = JSON.parse(localStorage.getItem('cmms_user') || 'null');
    if (token && user) return { token, user };
  } catch {
    // ignore parse errors
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = (token, user) => {
    localStorage.setItem('cmms_token', token);
    localStorage.setItem('cmms_user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('cmms_token');
    localStorage.removeItem('cmms_user');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ─── Route Guards ─────────────────────────────────────────────────────────────

// Blocks unauthenticated users → sends to /login
const ProtectedRoute = () => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Blocks users whose role isn't in the allowed list → sends to /unauthorized
const RoleRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  if (!allowedRoles.includes(auth?.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

// After login, redirect to the right home screen based on role
const RoleHome = () => {
  const { auth } = useAuth();
  const role = auth?.user?.role;
  if (role === 'admin' || role === 'maintenance') return <Navigate to="/dashboard" replace />;
  if (role === 'operator') return <Navigate to="/tickets" replace />;
  return <Navigate to="/login" replace />;
};

// ─── Placeholder pages (Dev B replaces these as pages are built) ──────────────

const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
        Coming Soon
      </p>
      <h1 className="text-2xl font-black uppercase tracking-tight text-gray-100">
        {title}
      </h1>
      <p className="text-sm text-gray-600 mt-2">
        This page is under construction.
      </p>
    </div>
  </div>
);


// ─── App ──────────────────────────────────────────────────────────────────────

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected — all roles */}
          <Route element={<ProtectedRoute />}>
            {/* Role-based home redirect */}
            <Route path="/" element={<RoleHome />} />

            {/* Admin + Maintenance only */}
            <Route element={<RoleRoute allowedRoles={['admin', 'maintenance']} />}>
              <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
              <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            </Route>

            {/* Admin only */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/master-data" element={<PlaceholderPage title="Master Data" />} />
              <Route path="/users" element={<PlaceholderPage title="User Management" />} />
            </Route>

            {/* All roles */}
            <Route path="/tickets" element={<PlaceholderPage title="Tickets" />} />
            <Route path="/tickets/new" element={<PlaceholderPage title="New Ticket" />} />
            <Route path="/tickets/:id" element={<PlaceholderPage title="Ticket Detail" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;