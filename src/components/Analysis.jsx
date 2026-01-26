import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Cell } from 'recharts';

// Color Mapping for Tastes
const TASTE_COLORS = {
    sour: '#FFD700',      // Gold/Yellow
    lemon: '#FFD700',
    acidic: '#FFD700',

    bitter: '#6F4E37',    // Coffee Brown
    chocolate: '#6F4E37',
    body: '#6F4E37',

    salty: '#E0E0E0',     // White/Grey
    salt: '#E0E0E0',

    sweet: '#FF69B4',     // Pink
    balanced: '#2A9D8F',  // Teal (Success)
    simple: '#2A9D8F',
    magic: '#2A9D8F',

    astringent: '#9B5DE5', // Purple
    cactus: '#9B5DE5',

    weak: '#A8DADC',      // Light Blue
    water: '#A8DADC',

    muddled: '#808080',   // Grey
    ghost: '#808080',

    default: '#E63946'    // Red (Unknown/Bad)
};

export function Analysis({ logs, currentCoffee }) {
    // Legend items
    const LEGEND_ITEMS = [
        { label: 'Sour/Acidic', color: TASTE_COLORS.sour },
        { label: 'Bitter', color: TASTE_COLORS.bitter },
        { label: 'Sweet', color: TASTE_COLORS.sweet },
        { label: 'Balanced', color: TASTE_COLORS.balanced },
        { label: 'Salty', color: TASTE_COLORS.salty },
        { label: 'Default/Other', color: TASTE_COLORS.default },
    ];

    const [chartType, setChartType] = useState('extraction'); // 'extraction' or 'ratio'
    const [filterByCoffee, setFilterByCoffee] = useState(false); // Default to SHOW ALL

    // Filter valid data points
    const data = logs.filter(log => {
        const isValid = log.dose && log.yield && log.time && parseFloat(log.dose) > 0;
        if (!isValid) return false;

        // Apply Coffee Name Filter if enabled and user has typed a name
        if (filterByCoffee && currentCoffee && log.coffeeName) {
            return log.coffeeName.toLowerCase().includes(currentCoffee.toLowerCase());
        }
        return true;
    }).map(log => ({
        ...log,
        doseVal: parseFloat(log.dose),
        yieldVal: parseFloat(log.yield),
        timeVal: parseFloat(log.time),
        ratio: parseFloat(log.yield) / parseFloat(log.dose),
        // Map color based on taste tag (normalized)
        color: TASTE_COLORS[log.taste?.toLowerCase()] || TASTE_COLORS.default
    }));

    console.log("Analysis Data:", data); // DEBUG LOG

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div style={{ background: '#00283D', border: `2px solid ${d.color}`, padding: '10px', borderRadius: '8px', color: '#EAE2B7' }}>
                    <p style={{ fontWeight: 800, margin: '0 0 5px 0' }}>{d.coffeeName || 'Unknown Coffee'}</p>
                    <p style={{ margin: 0 }}>In: {d.doseVal}g | Out: {d.yieldVal}g</p>
                    <p style={{ margin: 0 }}>Time: {d.timeVal}s | Ratio: 1:{d.ratio.toFixed(1)}</p>
                    <p style={{ margin: 0, color: d.color, textTransform: 'capitalize' }}>Taste: {d.taste || 'Unknown'}</p>
                </div>
            );
        }
        return null;
    };

    // Handle empty state
    if (logs.length === 0) {
        return (
            <div className="analysis-container placeholder">
                <p>Log your first brew to see the Analysis Charts!</p>
            </div>
        );
    }

    if (data.length === 0 && logs.length > 0) {
        return (
            <div className="analysis-container placeholder">
                <p>No logs found for <strong>{currentCoffee || "this coffee"}</strong>.</p>
                <button className="text-btn" onClick={() => setFilterByCoffee(false)}>Show All History</button>
            </div>
        );
    }

    return (
        <div className="analysis-container">
            <div className="chart-header">
                <h2>Extraction Map</h2>
                <div className="controls-row">
                    <div className="toggle-group">
                        <button
                            className={chartType === 'extraction' ? 'active' : ''}
                            onClick={() => setChartType('extraction')}
                        >
                            Time vs Yield
                        </button>
                        <button
                            className={chartType === 'ratio' ? 'active' : ''}
                            onClick={() => setChartType('ratio')}
                        >
                            In vs Out
                        </button>
                    </div>
                </div>
                {/* Filter Toggle */}
                {currentCoffee && (
                    <div className="filter-toggle" onClick={() => setFilterByCoffee(!filterByCoffee)}>
                        <div className={`checkbox ${filterByCoffee ? 'checked' : ''}`}></div>
                        <span>Only "{currentCoffee}"</span>
                    </div>
                )}
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />

                        <XAxis
                            type="number"
                            dataKey={chartType === 'extraction' ? "timeVal" : "doseVal"}
                            name={chartType === 'extraction' ? "Time" : "Dose"}
                            unit={chartType === 'extraction' ? "s" : "g"}
                            stroke="#EAE2B7"
                            label={{ value: chartType === 'extraction' ? "Time (s)" : "Dose In (g)", position: 'bottom', fill: '#FCBF49', offset: 0 }}
                            domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <YAxis
                            type="number"
                            dataKey="yieldVal"
                            name="Yield"
                            unit="g"
                            stroke="#EAE2B7"
                            label={{ value: "Yield Out (g)", angle: -90, position: 'insideLeft', fill: '#FCBF49' }}
                            domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        {/* Background Zones for Extraction View */}
                        {chartType === 'extraction' && (
                            <>
                                {/* Sour (Under-extracted) - Fast */}
                                <ReferenceArea x1={0} x2={22} fill={TASTE_COLORS.sour} fillOpacity={0.3} strokeOpacity={0} />

                                {/* Balanced - Ideal Window */}
                                <ReferenceArea x1={22} x2={32} fill={TASTE_COLORS.balanced} fillOpacity={0.3} strokeOpacity={0} />

                                {/* Bitter (Over-extracted) - Slow */}
                                <ReferenceArea x1={32} fill={TASTE_COLORS.bitter} fillOpacity={0.3} strokeOpacity={0} />
                            </>
                        )}

                        {/* Reference Lines for Standard Ratios (only in Ratio view) */}
                        {chartType === 'ratio' && (
                            <>
                                <ReferenceLine
                                    segment={[{ x: 0, y: 0 }, { x: 30, y: 60 }]}
                                    stroke="#ffffff33"
                                    strokeDasharray="3 3"
                                    label={{ value: "1:2", fill: "#ffffff88", fontSize: 10, position: 'insideTopRight' }}
                                />
                            </>
                        )}

                        <Scatter name="Logs" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={1} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <style>{`
                .analysis-container {
                    width: 100%;
                    min-height: 400px;
                    margin-top: 40px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 16px;
                    padding: 20px;
                }
                .analysis-container.placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #EAE2B7;
                    border: 2px dashed #EAE2B7;
                    background: transparent;
                }
                .chart-header {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .controls-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .toggle-group {
                    display: flex;
                    gap: 8px;
                }
                .toggle-group button {
                    padding: 6px 12px;
                    background: transparent;
                    color: #EAE2B7;
                    border: 1px solid #EAE2B7;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.8rem;
                }
                .toggle-group button.active {
                    background: #EAE2B7;
                    color: #003049;
                }
                .filter-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: #FCBF49;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .checkbox {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #FCBF49;
                    border-radius: 4px;
                }
                .checkbox.checked {
                    background: #FCBF49;
                }
                .text-btn {
                    background: transparent;
                    border: none;
                    color: #FCBF49;
                    text-decoration: underline;
                    cursor: pointer;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
}
