// App.jsx

import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import {
  restoreSession,
  selectUser,
  selectIsAuthenticated,
  selectInitializing,
  logoutThunk,
} from "./store/authSlice";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// ─── Loaders & Guards ─────────────────────────────────────────────────────────

const AppLoader = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 bg-amber-500 animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
        Loading…
      </span>
    </div>
  </div>
);

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initializing = useSelector(selectInitializing);

  if (initializing) return <AppLoader />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


const RoleRoute = ({ allowedRoles }) => {
  const user = useSelector(selectUser);
  const initializing = useSelector(selectInitializing);

  if (initializing) return <AppLoader />;

  if (!allowedRoles.includes(user?.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

const RoleHome = () => {
  const user = useSelector(selectUser);
  if (user?.role === "admin") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/tickets" replace />;
};

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
        Coming Soon
      </p>
      <h1 className="text-2xl font-black uppercase tracking-tight text-gray-100">
        {title}
      </h1>
    </div>
  </div>
);

// ─── Router (no session logic here) ──────────────────────────────────────────

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoleHome />} />

          <Route
            element={<RoleRoute allowedRoles={["admin", "maintenance"]} />}
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/reports"
              element={<PlaceholderPage title="Reports" />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              path="/master-data"
              element={<PlaceholderPage title="Master Data" />}
            />
            <Route
              path="/users"
              element={<PlaceholderPage title="User Management" />}
            />
          </Route>

          <Route
            path="/tickets"
            element={<PlaceholderPage title="Tickets" />}
          />
          <Route
            path="/tickets/new"
            element={<PlaceholderPage title="New Ticket" />}
          />
          <Route
            path="/tickets/:id"
            element={<PlaceholderPage title="Ticket Detail" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

// ─── App root — restoreSession fires ONCE here, above the router ──────────────

const AppRoot = () => {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    dispatch(restoreSession());
  }, []);

  return <AppRouter />;
};

const App = () => (
  <Provider store={store}>
    <AppRoot />
  </Provider>
);

export default App;
