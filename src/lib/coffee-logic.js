/**
 * Coffee Compass Logic
 * 
 * Basic principles:
 * Sour = Under-extracted => Need more extraction (Finer grind, hotter water, longer time, higher ratio)
 * Bitter = Over-extracted => Need less extraction (Coarser grind, cooler water, shorter time, lower ratio)
 * 
 * We will prioritize Grind Size as the primary variable, then Ratio/Yield.
 */

export const TASTE_PROFILE = {
    SOUR: 'sour',
    BITTER: 'bitter',
    BALANCED: 'balanced', // Goal
    WEAK: 'weak',   // Low strength
    STRONG: 'strong' // High strength
};

export const ADJUSTMENT_TYPE = {
    GRIND: 'grind',
    RATIO: 'ratio',
    TEMP: 'temp',
    NONE: 'none'
};

/**
 * Returns a recommendation based on taste and current brewing method.
 * @param {string} taste - One of TASTE_PROFILE values
 * @param {string} method - 'espresso' or 'filter' (future proofing)
 * @returns {object} { type: string, message: string, icon: string }
 */
export function getRecommendation(taste, method = 'espresso') {
    if (taste === TASTE_PROFILE.BALANCED) {
        return {
            type: ADJUSTMENT_TYPE.NONE,
            message: "Perfect! Enjoy your coffee.",
            icon: "✨"
        };
    }

    if (taste === TASTE_PROFILE.SOUR) {
        return {
            type: ADJUSTMENT_TYPE.GRIND,
            message: "Extract more. Grind Finer.",
            detail: "If you cannot grind finer, try increasing the water temperature or using more water (higher ratio).",
            icon: "🤏" // Pinching hand for finer? Or small grains?
        };
    }

    if (taste === TASTE_PROFILE.BITTER) {
        return {
            type: ADJUSTMENT_TYPE.GRIND,
            message: "Extract less. Grind Coarser.",
            detail: "If you cannot grind coarser, try decreasing water temperature or using less water (lower ratio).",
            icon: "🪨" // Rock for coarser?
        };
    }

    if (taste === TASTE_PROFILE.WEAK) {
        return {
            type: ADJUSTMENT_TYPE.RATIO,
            message: "Increase Dose (More Coffee).",
            detail: "Or use less water to increase concentration.",
            icon: "💪"
        };
    }

    if (taste === TASTE_PROFILE.STRONG) {
        return {
            type: ADJUSTMENT_TYPE.RATIO,
            message: "Decrease Dose (Less Coffee).",
            detail: "Or use more water to dilute.",
            icon: "💧"
        };
    }

    return {
        type: ADJUSTMENT_TYPE.NONE,
        message: "Keep tasting...",
        icon: "☕"
    };
}
