
export function RecipeInput({ dose, yieldValue, time, temperature, coffeeName, onDoseChange, onYieldChange, onTimeChange, onTemperatureChange, onNameChange, method }) {

  // Calculate ratio
  const ratio = (dose && yieldValue)
    ? (parseFloat(yieldValue) / parseFloat(dose)).toFixed(1)
    : '0';

  const isFilter = method === 'filter';

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

      {isFilter && (
        <div className="temp-section">
          <div className="input-group full-width">
            <label>Water Temp (°C)</label>
            <input
              type="number"
              value={temperature || ''}
              onChange={(e) => onTemperatureChange(e.target.value)}
              placeholder="e.g. 93"
            />
          </div>
          <div className="quick-choice-row">
            {[100, 96, 93, 90].map(temp => (
              <button
                key={temp}
                className={`choice-chip ${parseInt(temperature) === temp ? 'active' : ''}`}
                onClick={() => onTemperatureChange(temp.toString())}
              >
                {temp}°
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ratio-display">
        Current Ratio: <strong>1:{ratio}</strong>
      </div>

      <style>{`
        .recipe-input-container {
          background: var(--bg-surface);
          padding: 24px;
          border-radius: 16px;
          border: var(--border-width) solid var(--divider);
          margin-bottom: var(--spacing-xl);
          box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
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
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        input {
          padding: 12px 16px;
          border-radius: 8px;
          border: var(--border-width) solid var(--divider);
          background: var(--bg-base);
          color: var(--text-main);
          font-size: 1.1rem;
          font-weight: 700;
          width: 100%;
          transition: border-color 0.2s;
        }

        input.text-input {
           text-align: left;
           font-weight: 600;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--bg-surface);
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
          padding-top: 16px;
          border-top: 1px solid var(--divider); /* kept thin inside */
          margin-top: 8px;
          font-weight: 600;
        }

        .ratio-display strong {
           font-weight: 800;
           color: var(--primary);
           font-size: 1.1rem;
        }

        /* Temp Section */
        .temp-section {
          margin-bottom: 12px;
          animation: fadeIn 0.3s ease;
        }

        .quick-choice-row {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .choice-chip {
          flex: 1;
          padding: 8px;
          border-radius: 20px;
          border: var(--border-width) solid var(--divider);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .choice-chip:hover {
          background: var(--bg-surface-hover);
        }

        .choice-chip.active {
          background: var(--text-main);
          color: var(--bg-base);
          border-color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
