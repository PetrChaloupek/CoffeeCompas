export function History({ logs, onDelete }) {
  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div className="history-section">
      <h3>📜 Brew History</h3>
      <div className="history-list">
        {logs.map((log) => (
          <div key={log.id} className="history-card">
            <div className="history-header">
              <span className="log-date">{new Date(log.date).toLocaleDateString()}</span>
              <span className="log-method">{log.method}</span>
            </div>

            {log.coffeeName && <div className="log-name">☕ {log.coffeeName}</div>}

            <div className="log-details">
              <span>{log.dose}g ➔ {log.yield}g</span>
              {log.time && <span>⏱️ {log.time}s</span>}
            </div>

            <div className="log-notes">
              {log.taste && <span className="log-taste">{log.taste}</span>}
              {log.preference && <span className="log-pref">Goal: {log.preference}</span>}
            </div>

            <button className="delete-btn" onClick={() => onDelete(log.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .history-section {
          width: 100%;
          margin-top: var(--spacing-xl);
          border-top: 1px solid var(--divider);
          padding-top: var(--spacing-l);
        }

        .history-section h3 {
          text-align: center;
          margin-bottom: var(--spacing-m);
          color: var(--text-secondary);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }

        .history-card {
          background: var(--bg-surface);
          border: 1px solid var(--divider);
          border-radius: 12px;
          padding: 12px;
          position: relative;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .log-method {
          text-transform: capitalize;
          font-weight: 600;
        }
        
        .log-name {
           font-weight: 800;
           font-size: 1.1rem;
           color: var(--primary);
           margin-bottom: 4px;
        }

        .log-details {
          display: flex;
          gap: var(--spacing-m);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .log-notes {
          display: flex;
          gap: 8px;
          font-size: 0.9rem;
          flex-wrap: wrap;
        }

        .log-taste {
          background: var(--divider);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .log-pref {
          color: var(--text-secondary);
          padding: 4px 0;
        }

        .delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          padding: 0 4px;
        }
        
        .delete-btn:hover {
           color: var(--bitter);
        }
      `}</style>
    </div>
  );
}
