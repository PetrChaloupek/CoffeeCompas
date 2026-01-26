import { useState, useEffect } from 'react';
import { getRecommendation, TASTE_PROFILE, TASTE_GOAL } from '../lib/coffee-logic';
import { RecipeInput } from './RecipeInput';
import { History } from './History';

export function Compass() {
  const [method, setMethod] = useState('espresso'); // 'espresso' or 'filter'
  const [taste, setTaste] = useState(null);
  const [preference, setPreference] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  // Recipe State
  const [dose, setDose] = useState('');
  const [yieldValue, setYieldValue] = useState('');
  const [time, setTime] = useState('');
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
      updateRec(taste, preference, newMethod, dose, yieldValue, time);
    }
  };

  const handleTasteSelect = (selectedTaste) => {
    setTaste(selectedTaste);
    // Only skip preference if it's Balanced
    if (selectedTaste === TASTE_PROFILE.BALANCED) {
      updateRec(selectedTaste, null, method, dose, yieldValue, time);
    } else {
      // Go to Preference Step for everything else (including Weak/Strong)
      setPreference(null);
      setRecommendation(null);
    }
  };

  const handlePreferenceSelect = (selectedGoal) => {
    setPreference(selectedGoal);
    updateRec(taste, selectedGoal, method, dose, yieldValue, time);
  }

  const updateRec = (t, g, m, d, y, tm) => {
    const rec = getRecommendation(t, { dose: d, yield: y, time: tm, method: m, goal: g });
    if (rec) {
      setRecommendation(rec);
    }
  }

  // Update logic when inputs change if we already have a rec
  const handleInputChange = (field, value) => {
    // Store temp values
    let d = dose, y = yieldValue, t = time;
    if (field === 'dose') { setDose(value); d = value; }
    if (field === 'yield') { setYieldValue(value); y = value; }
    if (field === 'time') { setTime(value); t = value; }

    if (recommendation) {
      updateRec(taste, preference, method, d, y, t);
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
        coffeeName={coffeeName}
        onDoseChange={(v) => handleInputChange('dose', v)}
        onYieldChange={(v) => handleInputChange('yield', v)}
        onTimeChange={(v) => handleInputChange('time', v)}
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
              <span className="emoji">🍋</span>
              <span className="label">Sour</span>
            </button>
            <button
              className="taste-btn bitter"
              onClick={() => handleTasteSelect(TASTE_PROFILE.BITTER)}>
              <span className="emoji">🍫</span>
              <span className="label">Bitter</span>
            </button>

            {/* Row 2: Advanced Defects */}
            <button
              className="taste-btn salty"
              onClick={() => handleTasteSelect(TASTE_PROFILE.SALTY)}>
              <span className="emoji">🧂</span>
              <span className="label">Salty</span>
            </button>
            <button
              className="taste-btn astringent"
              onClick={() => handleTasteSelect(TASTE_PROFILE.ASTRINGENT)}>
              <span className="emoji">🌵</span>
              <span className="label">Dry / Astr.</span>
            </button>

            {/* Row 3: Strength/Body */}
            <button
              className="taste-btn weak"
              onClick={() => handleTasteSelect(TASTE_PROFILE.WEAK)}>
              <span className="emoji">💧</span>
              <span className="label">Weak</span>
            </button>
            <button
              className="taste-btn strong"
              onClick={() => handleTasteSelect(TASTE_PROFILE.STRONG)}>
              <span className="emoji">🥊</span>
              <span className="label">Strong</span>
            </button>

            {/* Row 4: Hollow */}
            <button
              className="taste-btn hollow"
              onClick={() => handleTasteSelect(TASTE_PROFILE.HOLLOW)}>
              <span className="emoji">👻</span>
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
              <span className="emoji">🍋</span>
              <span className="label">More Fruity / Acidic</span>
            </button>
            <button
              className="taste-btn pref-sweet"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.SWEET)}>
              <span className="emoji">🍯</span>
              <span className="label">More Sweetness</span>
            </button>
            <button
              className="taste-btn pref-body"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.BODY)}>
              <span className="emoji">🍫</span>
              <span className="label">More Body</span>
            </button>
            <button
              className="taste-btn pref-fix"
              onClick={() => handlePreferenceSelect(TASTE_GOAL.FIX_IT)}>
              <span className="emoji">🛠️</span>
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
            <div className="icon">{recommendation.icon}</div>
            <h3>{recommendation.message}</h3>
            {recommendation.detail && <p className="detail">{recommendation.detail}</p>}

            <button className="save-btn" onClick={saveLog}>
              💾 Save Log
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
          background: var(--bg-surface);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: var(--spacing-l);
          border: 1px solid var(--divider);
        }

        .method-btn {
          flex: 1;
          padding: 10px;
          background: transparent;
          color: var(--text-secondary);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .method-btn.active {
          background: var(--bg-surface);
          background: var(--primary);
          color: #000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .question-section {
          width: 100%;
          animation: fadeIn 0.3s ease-in;
        }
        
        h2 {
           text-align: center;
           margin-bottom: var(--spacing-l);
           font-size: 1.5rem;
           color: var(--text-main);
        }

        .taste-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-s); /* Tighter gap for more buttons */
          width: 100%;
        }

        .taste-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100px; 
          padding: var(--spacing-m);
          border: none;
          border-radius: 16px;
          color: #121212; 
          font-weight: 700;
          font-size: 1rem; /* Slightly smaller text */
          transition: transform 0.1s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        
        .taste-btn:active {
          transform: scale(0.96);
        }

        .taste-btn .emoji {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        /* Specific Colors */
        .taste-btn.sour { background: var(--sour); }
        .taste-btn.bitter { background: var(--bitter); color: white; }
        .taste-btn.weak { background: var(--weak); }
        .taste-btn.strong { background: var(--strong-color); color: white; }
        
        /* New Advanced Colors */
        .taste-btn.salty { background: #4DB6AC; /* Teal */ }
        .taste-btn.astringent { background: #D7CCC8; /* Beige/Sand */ }
        
        .taste-btn.hollow { 
           grid-column: span 2;
           background: #90A4AE; /* Blue Grey */ 
           flex-direction: row;
           gap: var(--spacing-m);
        }
        .taste-btn.hollow .emoji { margin-bottom: 0; }
        
        /* PREFERENCE BUTTONS */
        .pref-acidic { background: #FFEB3B; }
        .pref-sweet { background: #FF9800; }
        .pref-body { background: #795548; color: white;}
        .pref-fix { background: var(--divider); color: white; }

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
          background: var(--bg-surface);
          border: 1px solid var(--divider);
          border-radius: 20px;
          padding: var(--spacing-xl);
          text-align: center;
          width: 100%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .method-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          background: var(--divider);
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-bottom: var(--spacing-m);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .result-section .icon {
          font-size: 5rem;
          margin-bottom: var(--spacing-m);
        }

        .result-section h3 {
          font-size: 1.8rem;
          margin-bottom: var(--spacing-s);
          color: var(--text-main);
        }

        .detail {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }

        .reset-btn {
          width: 100%;
          padding: 20px;
          background: transparent;
          color: var(--text-main);
          border: 2px solid var(--divider);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .reset-btn:active {
           background: var(--divider);
        }

        .save-btn {
           margin-top: var(--spacing-m);
           background: var(--ok);
           border: none;
           padding: 8px 16px;
           border-radius: 8px;
           font-weight: bold;
           color: #000;
           cursor: pointer;
        }

        .save-btn:active { transform: scale(0.95); }
           
        .back-btn {
            margin-top: var(--spacing-m);
            background: transparent;
            border: none;
            color: var(--text-secondary);
            width: 100%;
            padding: 10px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
