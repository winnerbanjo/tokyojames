'use client';

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TOKYO JAMES — Admin Control Center</title>
        <meta name="description" content="TOKYO JAMES Official Luxury E-Commerce Admin Dashboard." />
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Helvetica Neue', sans-serif", background: '#09090b', color: '#f4f4f5' }}>
        
        {/* ADMIN TOP BAR */}
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
            <span style={{ fontSize: '12px', color: '#71717a' }}>Logged in as System Admin</span>
          </div>
        </header>

        {/* ADMIN CONTENT */}
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>

      </body>
    </html>
  );
}
