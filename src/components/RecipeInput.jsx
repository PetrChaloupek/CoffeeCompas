
export function RecipeInput({ dose, yield: yieldValue, time, coffeeName, onDoseChange, onYieldChange, onTimeChange, onNameChange, method }) {

  // Calculate ratio
  const ratio = (dose && yieldValue)
    ? (parseFloat(yieldValue) / parseFloat(dose)).toFixed(1)
    : '0';

  return (
    <div className="recipe-input-container">
      {/* Coffee Name Input */}
      <div className="input-group full-width">
        <label>Coffee Name / Bean</label>
        <input
          type="text"
          value={coffeeName || ''}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Ethiopia Natural"
          className="text-input"
        />
      </div>

      <div className="input-row">
        <div className="input-group">
          <label>Dose (g)</label>
          <input
            type="number"
            value={dose}
            onChange={(e) => onDoseChange(e.target.value)}
            placeholder={method === 'espresso' ? "18" : "15"}
          />
        </div>

        <div className="input-group">
          <label>Yield (g)</label>
          <input
            type="number"
            value={yieldValue}
            onChange={(e) => onYieldChange(e.target.value)}
            placeholder={method === 'espresso' ? "36" : "250"}
          />
        </div>

        <div className="input-group">
          <label>Time (s)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            placeholder={method === 'espresso' ? "28" : "180"}
          />
        </div>
      </div>

      <div className="ratio-display">
        Current Ratio: <strong>1:{ratio}</strong>
      </div>

      <style>{`
        .recipe-input-container {
          background: var(--bg-surface);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--divider);
          margin-bottom: var(--spacing-xl);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .input-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .input-group.full-width {
           margin-bottom: 12px;
           width: 100%;
        }

        label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-weight: 600;
          text-transform: uppercase;
        }

        input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--divider);
          background: var(--bg);
          color: var(--text-main);
          font-size: 1.1rem;
          font-weight: 600;
          width: 100%;
          transition: border-color 0.2s;
        }

        input.text-input {
           text-align: left;
           font-weight: 500;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
        }

        /* Remove arrows from number input */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .ratio-display {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          padding-top: 8px;
          border-top: 1px solid var(--divider);
        }
           font-weight: bold;
           color: var(--primary);
        }
      `}</style>
    </div>
  );
}
