import { useState, useEffect } from 'react';
import { getRecommendation, TASTE_PROFILE, TASTE_GOAL } from '../lib/coffee-logic';
import { RecipeInput } from './RecipeInput';
import { History } from './History';
import { Icon } from './Icon';

export function Compass() {
  const [method, setMethod] = useState('espresso'); // 'espresso' or 'filter'
  const [taste, setTaste] = useState(null);
  const [preference, setPreference] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  // Recipe State
  const [dose, setDose] = useState('');
  const [yieldValue, setYieldValue] = useState('');
  const [time, setTime] = useState('');
  const [temperature, setTemperature] = useState(''); // New state for Temp
  const [coffeeName, setCoffeeName] = useState('');

  // History State
  const [logs, setLogs] = useState([]);

  // Load logs on mount
  useEffect(() => {
    const saved = localStorage.getItem('coffee-logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  // Save logs whenever they change
  useEffect(() => {
    localStorage.setItem('coffee-logs', JSON.stringify(logs));
  }, [logs]);

  const saveLog = () => {
    if (!dose || !yieldValue) {
      alert("Please enter at least Dose and Yield to save.");
      return;
    }

    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      method,
      coffeeName,
      dose,
      yield: yieldValue,
      time,
      temperature, // Save temp
      taste,
      preference
    };
    setLogs([newLog, ...logs]);
  };

  const deleteLog = (id) => {
    setLogs(logs.filter(l => l.id !== id));
  };


  // Handle method change
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    // If we have a rec, update it live
    if (recommendation) {
      updateRec(taste, preference, newMethod, dose, yieldValue, time, temperature);
    }
  };

  const handleTasteSelect = (selectedTaste) => {
    setTaste(selectedTaste);
    // Only skip preference if it's Balanced
    if (selectedTaste === TASTE_PROFILE.BALANCED) {
      updateRec(selectedTaste, null, method, dose, yieldValue, time, temperature);
    } else {
      // Go to Preference Step for everything else (including Weak/Strong)
      setPreference(null);
      setRecommendation(null);
    }
  };

  const handlePreferenceSelect = (selectedGoal) => {
    setPreference(selectedGoal);
    updateRec(taste, selectedGoal, method, dose, yieldValue, time, temperature);
  }

  const updateRec = (t, g, m, d, y, tm, temp) => {
    const rec = getRecommendation(t, { dose: d, yield: y, time: tm, temp, method: m, goal: g });
    if (rec) {
      setRecommendation(rec);
    }
  }

  // Update logic when inputs change if we already have a rec
  const handleInputChange = (field, value) => {
    // Store temp values
    let d = dose, y = yieldValue, t = time, temp = temperature;
    if (field === 'dose') { setDose(value); d = value; }
    if (field === 'yield') { setYieldValue(value); y = value; }
    if (field === 'time') { setTime(value); t = value; }
    if (field === 'temperature') { setTemperature(value); temp = value; }

    if (recommendation) {
      updateRec(taste, preference, method, d, y, t, temp);
    }
  }

  const reset = () => {
    setTaste(null);
    setPreference(null);
    setRecommendation(null);
  };

  return (
    <div className="compass-container">
      <div className="method-selector">
        <button
          className={`method-btn ${method === 'espresso' ? 'active' : ''}`}
          onClick={() => handleMethodChange('espresso')}
        >
          Espresso
        </button>
        <button
          className={`method-btn ${method === 'filter' ? 'active' : ''}`}
          onClick={() => handleMethodChange('filter')}
        >
          Filter / V60
        </button>
      </div>

      <RecipeInput
        dose={dose}
        yield={yieldValue}
        time={time}
        temperature={temperature}
        coffeeName={coffeeName}
        onDoseChange={(v) => handleInputChange('dose', v)}
        onYieldChange={(v) => handleInputChange('yield', v)}
        onTimeChange={(v) => handleInputChange('time', v)}
        onTemperatureChange={(v) => handleInputChange('temperature', v)}
        onNameChange={setCoffeeName}
        method={method}
      />

      {/* STEP 1: SELECT TASTE */}
      {!taste ? (
        <div className="question-section">
          <h2>How does it taste?</h2>
          <div className="taste-grid">
            {/* Row 1: The Big Two */}
            <button
              className="taste-btn sour"
              onClick={() => handleTasteSelect(TASTE_PROFILE.SOUR)}>
              <Icon name="sour" />
              <span className="label">Sour</span>
            </button>
            <button
              className="taste-btn bitter"
              onClick={() => handleTasteSelect(TASTE_PROFILE.BITTER)}>
              <Icon name="bitter" />
              <span className="label">Bitter</span>
            </button>

            {/* Row 2: Advanced Defects */}
            <button
              className="taste-btn salty"
              onClick={() => handleTasteSelect(TASTE_PROFILE.SALTY)}>
              <Icon name="salty" />
              <span className="label">Salty</span>
            </button>
            <button
              className="taste-btn astringent"
              onClick={() => handleTasteSelect(TASTE_PROFILE.ASTRINGENT)}>
              <Icon name="astringent" />
              <span className="label">Dry / Astr.</span>
            </button>

            {/* Row 3: Strength/Body */}
            <button
              className="taste-btn weak"
              onClick={() => handleTasteSelect(TASTE_PROFILE.WEAK)}>
              <Icon name="weak" />
              <span className="label">Weak</span>
            </button>
            <button
              className="taste-btn strong"
              onClick={() => handleTasteSelect(TASTE_PROFILE.STRONG)}>
              <Icon name="strong" />
              <span className="label">Strong</span>
            </button>

            {/* Row 4: Hollow */}
            <button
              className="taste-btn hollow"
              onClick={() => handleTasteSelect(TASTE_PROFILE.HOLLOW)}>
              <Icon name="hollow" />
              <span className="label">Hollow / Empty</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* STEP 2: SELECT PREFERENCE (If defect selected and no rec yet) */}
      {taste && !recommendation ? (
        <div className="question-section">
          <h2>What is your goal?</h2>
          <div className="taste-grid">
            <button
              className="taste-btn pref-acidic"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.ACIDIC)}>
              <Icon name="acidic" />
              <span className="label">More Fruity / Acidic</span>
            </button>
            <button
              className="taste-btn pref-sweet"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.SWEET)}>
              <Icon name="sweet" />
              <span className="label">More Sweetness</span>
            </button>
            <button
              className="taste-btn pref-body"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.BODY)}>
              <Icon name="body" />
              <span className="label">More Body</span>
            </button>
            <button
              className="taste-btn pref-fix"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.FIX_IT)}>
              <Icon name="fix" />
              <span className="label">Just Fix the Taste</span>
            </button>
          </div>
          <button className="back-btn" onClick={() => setTaste(null)}>
            ← Back to Tastes
          </button>
        </div>
      ) : null}

      {/* STEP 3: RESULT */}
      {recommendation ? (
        <div className="result-section">
          <div className="result-card">
            <div className="method-badge">{method === 'espresso' ? 'Espresso' : 'Filter'} Advice</div>
            <div className="icon">
              <Icon name={recommendation.icon || 'default'} className="icon-svg big" />
            </div>
            <h3>{recommendation.message}</h3>
            {recommendation.detail && <p className="detail">{recommendation.detail}</p>}

            <button className="save-btn" onClick={saveLog}>
              Save Log
            </button>
          </div>

          <button className="reset-btn" onClick={reset}>
            Adjust & Taste Again
          </button>
        </div>
      ) : null}

      <History logs={logs} onDelete={deleteLog} />

      <style>{`
        .method-selector {
          display: flex;
          background: transparent;
          gap: 12px;
          margin-bottom: var(--spacing-l);
        }

        .method-btn {
          flex: 1;
          padding: 12px;
          background: transparent;
          color: var(--text-secondary);
          border: var(--border-width) solid var(--divider);
          border-radius: var(--radius-m);
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s;
          opacity: 0.7;
        }

        .method-btn.active {
          background: var(--text-main); /* Blue */
          color: var(--bg-base); /* Beige */
          border-color: var(--text-main);
          opacity: 1;
        }

        .question-section {
          width: 100%;
          animation: fadeIn 0.3s ease-in;
        }
        
        h2 {
           text-align: center;
           margin-bottom: var(--spacing-l);
           font-size: 1.2rem;
           color: var(--text-main);
           opacity: 0.8;
        }

        .taste-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-m);
          width: 100%;
        }

        .taste-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 120px; 
          padding: var(--spacing-m);
          border: var(--border-width) solid var(--divider);
          border-radius: var(--radius-l);
          background: var(--bg-surface);
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.9rem;
          transition: transform 0.1s, background-color 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .taste-btn:active {
          transform: scale(0.98);
        }
        
        .taste-btn:hover {
            background: var(--bg-surface-hover);
            border-color: var(--text-main);
        }

        .icon-svg {
          width: 48px;
          height: 48px;
          margin-bottom: 12px;
          stroke: var(--text-main);
        }
        
        .icon-svg.big {
            width: 80px;
            height: 80px;
        }

        /* Specific Colors for BUTTON BORDERS or ACCENTS if needed, 
           but currently using cleaner uniform look with hover colors */

        .taste-btn.sour { border-color: var(--sour); }
        .taste-btn.bitter { border-color: var(--bitter); }
        .taste-btn.strong { border-color: var(--strong); }
        .taste-btn.weak { border-color: var(--weak); }
        
        .taste-btn.hollow { 
           grid-column: span 2;
           flex-direction: row;
           gap: var(--spacing-m);
           min-height: 80px;
        }
        .taste-btn.hollow .icon-svg { margin-bottom: 0; width: 32px; height: 32px;}
        
        /* Result Section */
        .result-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: var(--spacing-xl);
          animation: fadeIn 0.3s ease-out;
        }

        .result-card {
          background: var(--text-main); /* Blue Card */
          color: var(--bg-base);       /* Beige Text */
          border: var(--border-width) solid var(--text-main);
          border-radius: 20px;
          padding: var(--spacing-xl);
          text-align: center;
          width: 100%;
          box-shadow: 12px 12px 0px rgba(0,0,0,0.2); /* Brutalist shadow */
        }
        
        .result-card .icon-svg {
            stroke: var(--bg-base); /* Beige Icon */
        }
        
        .result-card h3 {
            color: var(--primary); /* Orange Heading */
            font-size: 2rem;
            margin-bottom: var(--spacing-m);
        }
        
        .result-card .detail {
            color: var(--bg-base);
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .method-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 50px;
          background: var(--bg-surface-hover); /* Amber */
          color: var(--text-main);
          font-weight: 800;
          font-size: 0.75rem;
          margin-bottom: var(--spacing-m);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .reset-btn {
          width: 100%;
          padding: 24px;
          background: transparent;
          color: var(--text-main);
          border: var(--border-width) solid var(--text-main);
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        
        .reset-btn:hover {
           background: var(--bg-surface-hover);
        }

        .save-btn {
           margin-top: var(--spacing-l);
           background: var(--primary);
           border: 2px solid var(--text-main); /* Border for definition */
           padding: 12px 24px;
           border-radius: 8px;
           font-weight: 800;
           color: var(--text-main);
           text-transform: uppercase;
           cursor: pointer;
           width: 100%;
        }
           
        .back-btn {
            margin-top: var(--spacing-m);
            background: transparent;
            border: none;
            color: var(--text-secondary);
            width: 100%;
            padding: 10px;
            font-weight: 600;
        }
        
        .back-btn:hover {
            color: var(--text-main);
            text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
