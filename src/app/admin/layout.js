'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    localStorage.removeItem('tj_admin_auth');
    const check = () => fetch('/api/admin/session', { cache: 'no-store' }).then(r => r.json()).then(data => setIsAuthenticated(Boolean(data.authenticated))).catch(() => setIsAuthenticated(false)).finally(() => setChecking(false));
    check();
    const timer = setInterval(check, 60000);
    return () => clearInterval(timer);
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault(); if (busy) return; setBusy(true); setError('');
    try {
      const res = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Sign-in failed.');
      setPassword(''); setIsAuthenticated(true);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/session', { method: 'DELETE' });
      if (!res.ok) throw new Error('Unable to sign out. Please retry.');
      setIsAuthenticated(false);
    } catch (err) { alert(err.message); }
  };
  if (checking) return <p style={{ padding: 40 }}>Checking admin session…</p>;

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: "'Helvetica Neue', sans-serif" }}>

      {!isAuthenticated ? (
        /* LUXURY ADMIN LOGIN PORTAL WITH OFFICIAL LOGO */
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: '20px' }}>
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/images/tokyo_james_logo.png"
                alt="TOKYO JAMES"
                style={{ height: '28px', filter: 'invert(1)', mixBlendMode: 'screen', marginBottom: '8px' }}
              />
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#d00000', display: 'block' }}>
                ADMIN CONTROL PORTAL
              </span>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Admin Username / Email
                </label>
                <input
                  type="text" autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="admin@tokyojames.com"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Password
                </label>
                <input
                  type="password" autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit" disabled={busy}
                style={{ background: '#d00000', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s ease' }}
              >
                {busy ? 'Signing in…' : 'Sign In to Admin Dashboard →'}
              </button>
            </form>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #27272a', textAlign: 'center' }}>
              <a href="/" style={{ color: '#71717a', fontSize: '11px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ← Return to Main Storefront
              </a>
            </div>

          </div>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <>
          <header className="admin-header" style={{
            height: '64px',
            background: '#121215',
            borderBottom: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src="/images/tokyo_james_logo.png"
                alt="TOKYO JAMES"
                style={{ height: '22px', filter: 'invert(1)', mixBlendMode: 'screen' }}
              />
              <span className="admin-header-badge" style={{ background: '#d00000', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ADMIN CONTROL CENTER
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a
                href="/"
                style={{
                  fontSize: '12px',
                  color: '#a1a1aa',
                  textDecoration: 'none',
                  border: '1px solid #3f3f46',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                ← View Main Store
              </a>
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', color: '#ef4444', border: '1px solid #d00000', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase', fontWeight: '600' }}
              >
                Log Out
              </button>
            </div>
          </header>

          <main style={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
        </>
      )}

    </div>
  );
}
