/**
 * Coffee Compass Logic - "The Fixer"
 * 
 * Inputs: Dose, Yield, Time
 * Method: Espresso (default), Filter
 */

export const TASTE_PROFILE = {
    SOUR: 'sour',
    BITTER: 'bitter',
    BALANCED: 'balanced',
    WEAK: 'weak',
    STRONG: 'strong',
    // Advanced
    SALTY: 'salty',        // Under-extracted / Undersoluble
    HOLLOW: 'hollow',      // Lacks body/complexity
    ASTRINGENT: 'astringent', // Dry/Sandpapery (Channeling)
    MUDDLED: 'muddled'     // Low Clarity (New)
};

export const TASTE_GOAL = {
    ACIDIC: 'acidic',   // Wants more fruit/acidity
    SWEET: 'sweet',     // Wants more sweetness
    BODY: 'body',       // Wants more body
    FIX_IT: 'fix'       // Just fix the defect
};

export const ADJUSTMENT_TYPE = {
    GRIND: 'grind',
    RATIO: 'ratio',
    TEMP: 'temp',
    NONE: 'none'
};

/**
 * Returns a recommendation based on taste, numeric inputs, and brewing method.
 * @param {string} taste
 * @param {object} params - { dose, yield, time, method, goal }
 */
export function getRecommendation(taste, params = {}) {
    const { dose, yield: yieldValue, time, temp, method = 'espresso', goal = TASTE_GOAL.FIX_IT } = params;

    // Parse Inputs
    const d = parseFloat(dose) || 0;
    const y = parseFloat(yieldValue) || 0;
    const t = parseFloat(time) || 0;
    const temperature = temp ? parseFloat(temp) : null;
    const isFilter = method === 'filter';

    // Calculate Metrics
    const ratio = (d > 0 && y > 0) ? (y / d) : 0;
    const flowRate = (y > 0 && t > 0) ? (y / t) : 0;

    let rec = {
        type: ADJUSTMENT_TYPE.NONE,
        message: "Keep tasting...",
        icon: "coffee",
        detail: "",
        metrics: { ratio, flowRate }
    };

    if (taste === TASTE_PROFILE.BALANCED) {
        return { ...rec, message: "Perfect! Enjoy.", icon: "magic" };
    }

    // =========================================================
    // SOUR (Under-extracted / Solvent Limited)
    // =========================================================
    if (taste === TASTE_PROFILE.SOUR) {
        rec.icon = "lemon";
        rec.type = ADJUSTMENT_TYPE.RATIO;

        // Spec: "Increase Yield by ~10-15%"
        const targetYield = Math.round(y * 1.15);
        rec.message = `Increase Yield to ~${targetYield}g.`;
        rec.detail = "Solvent limited. Push extraction further to recruit more sugars. Keep grind size constant.";

        if (isFilter && temperature && temperature < 93) {
            rec.type = ADJUSTMENT_TYPE.TEMP;
            rec.message = "Increase Temp & Yield.";
            rec.detail = "Your water is cold. Heat to 96°C+ and extend the ratio.";
        }
    }

    // =========================================================
    // BITTER (Over-extracted / Dry Distillates)
    // =========================================================
    else if (taste === TASTE_PROFILE.BITTER) {
        rec.icon = "chocolate";
        rec.type = ADJUSTMENT_TYPE.RATIO;

        // Spec: "Decrease Yield by ~10%"
        const targetYield = Math.round(y * 0.90);
        rec.message = `Decrease Yield to ~${targetYield}g.`;
        rec.detail = "Cut the shot earlier to avoid dry distillates. Keep grind size constant.";

        if (isFilter && temperature && temperature >= 96) {
            rec.message = "Lower Temp & Decrease Yield.";
            rec.detail = `Too hot (${temperature}°C). Drop to 93°C and shorten the ratio.`;
        }
    }

    // =========================================================
    // ASTRINGENT (Channeling / Resistance)
    // =========================================================
    else if (taste === TASTE_PROFILE.ASTRINGENT) {
        rec.icon = "cactus";
        rec.type = ADJUSTMENT_TYPE.GRIND;

        // Spec: Check Flow Rate. If < 1.0, Critical.
        if (flowRate > 0 && flowRate < 1.0 && !isFilter) {
            rec.message = "CHOKED: Grind Coarser Immediately.";
            rec.detail = `Flow Rate is very low (${flowRate.toFixed(1)} g/s). Excessive resistance is causing channeling.`;
        } else {
            rec.message = "Grind Coarser.";
            rec.detail = "Dryness usually comes from channeling or uneven flow. Coarsening helps even out the puck.";
        }
    }

    // =========================================================
    // WEAK (Low TDS)
    // =========================================================
    else if (taste === TASTE_PROFILE.WEAK) {
        rec.icon = "water";
        rec.type = ADJUSTMENT_TYPE.RATIO;

        // Spec: Increase Dose OR Shorten Ratio
        rec.message = "Increase Dose +1g.";
        rec.detail = "Solution is too dilute. Increasing dose increases strength/texture.";

        if (ratio > 2.5 && !isFilter) {
            rec.message = "Decrease Yield (Shorten Ratio).";
            rec.detail = "You are running very long. Tighten the ratio (e.g. 1:2) to increase body.";
        }
    }

    // =========================================================
    // MUDDLED / HEAVY (Low Clarity - NEW)
    // =========================================================
    else if (taste === TASTE_PROFILE.MUDDLED) {
        rec.icon = "ghost"; // Reusing ghost for 'muddled/hollow' vibe or we can map a new one
        rec.type = ADJUSTMENT_TYPE.GRIND;

        rec.message = "Grind Coarser & Aim for Faster Flow.";
        rec.detail = flowRate > 0
            ? `Current flow (${flowRate.toFixed(1)} g/s) is likely too slow for clarity. Aim for > 2.0 g/s.`
            : "Too many fines are blurring the flavor. speed up the shot.";
    }

    // =========================================================
    // SALTY (Under-extracted)
    // =========================================================
    else if (taste === TASTE_PROFILE.SALTY) {
        rec.icon = "salt";
        rec.type = ADJUSTMENT_TYPE.RATIO;

        // Similar to Sour -> Push Yield
        const targetYield = Math.round(y * 1.2);
        rec.message = `Increase Yield Significantly (~${targetYield}g).`;
        rec.detail = "Saltiness is significantly under-extracted. Run it longer.";
    }

    // =========================================================
    // HOLLOW (Lacks Body)
    // =========================================================
    else if (taste === TASTE_PROFILE.HOLLOW) {
        rec.icon = "ghost";
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.message = "Increase Dose (More Coffee).";
        rec.detail = "Hollow means lack of substance. Add more coffee to the basket to increase resistance and body.";
    }

    // =========================================================
    // STRONG (Overpowering)
    // =========================================================
    else if (taste === TASTE_PROFILE.STRONG) {
        rec.icon = "muscle";
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.message = "Decrease Dose or Increase Yield.";
        rec.detail = "Too intense. Dilute it by adding more water (Yield) or using less coffee.";
    }

    return rec;
}
