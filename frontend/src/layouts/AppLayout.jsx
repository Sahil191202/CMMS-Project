// layouts/AppLayout.jsx
// Shell used by all protected pages.
// Structure: sidebar (left) + main area (topbar + <Outlet />)

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk, selectUser } from '../store/authSlice';

// ─── Nav item config ──────────────────────────────────────────────────────────
// visibleTo: which roles can see this nav item
const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    visibleTo: ['admin', 'maintenance'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    path: '/tickets',
    label: 'Tickets',
    visibleTo: ['admin', 'maintenance', 'operator'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    path: '/reports',
    label: 'Reports',
    visibleTo: ['admin', 'maintenance'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    path: '/master-data',
    label: 'Master Data',
    visibleTo: ['admin'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    path: '/users',
    label: 'Users',
    visibleTo: ['admin'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const visibleNav = NAV_ITEMS.filter((item) =>
    item.visibleTo.includes(user?.role)
  );

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={`
        flex flex-col bg-gray-900 border-r border-gray-800
        transition-all duration-200 shrink-0
        ${collapsed ? 'w-14' : 'w-52'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-14 border-b border-gray-800 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-7 h-7 bg-amber-500 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 truncate">
            ESAB CMMS
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {visibleNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-100
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800 border border-transparent'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="border-t border-gray-800 p-3">
        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-xs font-bold text-gray-300 truncate">{user?.name}</p>
            <p className="text-xs text-gray-600 capitalize truncate">{user?.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-colors duration-100 ${collapsed ? 'justify-center' : ''}`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ onToggleSidebar }) => {
  const user = useSelector(selectUser);

  // Current page label from location
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/tickets': 'Tickets',
    '/reports': 'Reports',
    '/master-data': 'Master Data',
    '/users': 'User Management',
  };
  const path = window.location.pathname;
  const title = Object.entries(pageTitles).find(([key]) => path.startsWith(key))?.[1] || 'CMMS';

  return (
    <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-gray-300 transition-colors p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">
          {user?.role}
        </span>
        {/* Avatar */}
        <div className="w-7 h-7 bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 uppercase">
          {user?.name?.charAt(0) || '?'}
        </div>
      </div>
    </header>
  );
};

// ─── Layout shell ─────────────────────────────────────────────────────────────
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onToggleSidebar={() => setCollapsed((c) => !c)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;