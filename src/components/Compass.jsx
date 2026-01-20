import { useState } from 'react';
import { getRecommendation, TASTE_PROFILE } from '../lib/coffee-logic';

export function Compass() {
    const [taste, setTaste] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    const handleTasteSelect = (selectedTaste) => {
        setTaste(selectedTaste);
        const rec = getRecommendation(selectedTaste);
        setRecommendation(rec);
    };

    const reset = () => {
        setTaste(null);
        setRecommendation(null);
    };

    return (
        <div className="compass-container">
            {!recommendation ? (
                <div className="question-section">
                    <h2>How does it taste?</h2>
                    <div className="taste-grid">
                        <button
                            className="taste-btn sour"
                            onClick={() => handleTasteSelect(TASTE_PROFILE.SOUR)}>
                            Sour / Acidic
                        </button>
                        <button
                            className="taste-btn bitter"
                            onClick={() => handleTasteSelect(TASTE_PROFILE.BITTER)}>
                            Bitter / Dry
                        </button>
                        <button
                            className="taste-btn weak"
                            onClick={() => handleTasteSelect(TASTE_PROFILE.WEAK)}>
                            Weak / Watery
                        </button>
                        <button
                            className="taste-btn strong"
                            onClick={() => handleTasteSelect(TASTE_PROFILE.STRONG)}>
                            Strong / Heavy
                        </button>
                        <button
                            className="taste-btn balanced"
                            onClick={() => handleTasteSelect(TASTE_PROFILE.BALANCED)}>
                            Perfect / Balanced
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result-section">
                    <div className="icon">{recommendation.icon}</div>
                    <h3>{recommendation.message}</h3>
                    {recommendation.detail && <p className="detail">{recommendation.detail}</p>}

                    <button className="reset-btn" onClick={reset}>
                        Adjust & Taste Again
                    </button>
                </div>
            )}

            <style>{`
        .question-section, .result-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-l);
          animation: fadeIn 0.3s ease-in;
        }

        .taste-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-m);
          width: 100%;
        }

        .taste-btn {
          padding: var(--spacing-m);
          border: 1px solid var(--divider);
          border-radius: 12px;
          background: var(--bg-surface);
          color: var(--text-main);
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .taste-btn:hover {
          background: var(--divider);
          transform: translateY(-2px);
        }

        .taste-btn.sour { border-color: var(--sour); color: var(--sour); }
        .taste-btn.bitter { border-color: var(--bitter); color: #Bcaaa4; } /* Lighter brown for visibility */
        .taste-btn.balanced { grid-column: span 2; border-color: var(--ok); color: var(--ok); }

        .result-section .icon {
          font-size: 4rem;
        }

        .result-section h3 {
          color: var(--primary);
          text-align: center;
        }

        .detail {
          color: var(--text-secondary);
          text-align: center;
        }

        .reset-btn {
          margin-top: var(--spacing-m);
          padding: var(--spacing-m) var(--spacing-xl);
          background: var(--primary);
          color: var(--bg-base);
          border: none;
          border-radius: 24px;
          font-weight: bold;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
