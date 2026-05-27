// LoginPage.jsx
// Uses: Input, Button from components/ui
// Calls: mockService.login()  →  swap for real axios call when Dev A's API is ready
// On success: stores auth in context, navigates by role

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import mockService from '../services/mockService';
import { useAuth } from '../App';

const LoginPage = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → skip login screen
  if (auth) {
    const role = auth.user?.role;
    if (role === 'operator') return <Navigate to="/tickets" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required.';
    if (!form.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const result = await mockService.login(form);
      console.log('[mockService.login] success →', result);

      // Store in context + localStorage
      login(result.token, result.user);

      // Navigate by role
      const role = result.user?.role;
      if (role === 'operator') {
        navigate('/tickets', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('[mockService.login] error →', err);
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 border-r border-gray-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              #fff 40px,
              #fff 41px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              #fff 40px,
              #fff 41px
            )`,
          }}
        />

        {/* Logo / brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">ESAB Industries</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-100 mt-8 leading-tight">
            Maintenance<br />Control System
          </h2>
          <p className="text-sm text-gray-500 mt-3 max-w-xs leading-relaxed">
            Centralized breakdown tracking, MTTR analysis, and machine health monitoring.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-gray-800 pt-8">
          {[
            { label: 'Machines Tracked', value: '48' },
            { label: 'Avg MTTR', value: '2.4h' },
            { label: 'Uptime This Month', value: '94%' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-amber-500">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-amber-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">ESAB CMMS</span>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-100">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to continue.
            </p>
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-400">{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange('username')}
              error={errors.username}
              required
              disabled={loading}
              autoComplete="username"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {/* Role hint for dev testing */}
          <div className="mt-8 border border-gray-800 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
              Dev Testing — Username shortcuts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'maintenance', 'operator'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ username: role, password: 'test' })}
                  className="text-xs py-1.5 px-2 bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700 transition-colors capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;