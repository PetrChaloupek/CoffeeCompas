
export function Layout({ children }) {
    return (
        <div className="layout">
            <header className="header">
                <h1>Coffee Compas</h1>
            </header>
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <p>&copy; 2026 Coffee Compas</p>
            </footer>

            <style>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          max-width: 600px;
          margin: 0 auto;
          background-color: var(--bg-surface);
          border-left: 1px solid var(--divider);
          border-right: 1px solid var(--divider);
        }
        
        .header {
          padding: var(--spacing-m);
          text-align: center;
          border-bottom: 1px solid var(--divider);
        }
        
        .header h1 {
          color: var(--primary);
          font-size: 1.5rem;
        }
        
        .main-content {
          flex: 1;
          padding: var(--spacing-m);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-l);
        }
        
        .footer {
          padding: var(--spacing-m);
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.8rem;
          border-top: 1px solid var(--divider);
        }
      `}</style>
        </div>
    );
}
