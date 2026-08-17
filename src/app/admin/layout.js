'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('tj_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'admin@tokyojames.com') && password === 'tokyojames2026') {
      localStorage.setItem('tj_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tj_admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <html lang="en">
      <head>
        <title>TOKYO JAMES — Admin Control Center</title>
        <meta name="description" content="TOKYO JAMES Official Luxury E-Commerce Admin Dashboard." />
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Helvetica Neue', sans-serif", background: '#09090b', color: '#f4f4f5' }}>
        
        {!isAuthenticated ? (
          /* LUXURY ADMIN LOGIN PORTAL */
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: '20px' }}>
            <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>
                  TOKYO JAMES
                </h1>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#d00000', display: 'block', marginTop: '4px' }}>
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
                    type="text" 
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
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    placeholder="••••••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  style={{ background: '#d00000', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s ease' }}
                >
                  Sign In to Admin Dashboard →
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
            <header style={{ 
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
                <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '3px', color: '#fff' }}>
                  TOKYO JAMES
                </span>
                <span style={{ background: '#d00000', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
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

      </body>
    </html>
  );
}
