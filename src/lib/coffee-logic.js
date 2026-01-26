/**
 * Coffee Compass Logic
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
    ASTRINGENT: 'astringent' // Dry/Sandpapery (Channeling)
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
    const isFilter = method === 'filter';
    const hasTime = time && parseFloat(time) > 0;
    const temperature = temp ? parseFloat(temp) : null;

    let rec = {
        type: ADJUSTMENT_TYPE.NONE,
        message: "Keep tasting...",
        icon: "coffee",
        detail: ""
    };

    if (taste === TASTE_PROFILE.BALANCED) {
        return { type: ADJUSTMENT_TYPE.NONE, message: "Perfect! Enjoy.", icon: "magic" };
    }

    // Helper for "Just Fix It" vs Specific Goals

    // =========================================================
    // SALTY (Under-extracted)
    // =========================================================
    if (taste === TASTE_PROFILE.SALTY) {
        rec.icon = "Salt"; // Emoji placeholder, will use text if not mapped
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.icon = "salt";

        if (goal === TASTE_GOAL.ACIDIC) {
            // User wants Acidic/Fruity. Salty means we are severely under, but we don't want to kill the acid.
            // Increase Yield (Ratio) is the safest way to clear salt without muting fruit like fine grind might.
            rec.message = "Increase Yield (More Water).";
            rec.detail = "Push the extraction further (longer ratio) to dissolve more sugars, clearing the saltiness while highlighting the acidity.";
        } else if (goal === TASTE_GOAL.SWEET) {
            // Wants Sweet. Needs SIGNIFICANTLY more extraction.
            rec.type = ADJUSTMENT_TYPE.GRIND;
            rec.message = "Grind Finer & Increase Temp.";
            rec.detail = "You are far from sweetness. You need more contact time and energy to access the sugar.";
        } else {
            // Default Fix
            rec.message = "Increase Yield (More Water).";
            rec.detail = "Saltiness is early extraction. Run the shot longer to balance it out.";
            if (isFilter) {
                if (temperature && temperature < 93) {
                    rec.message = "Increase Water Temp & Grind Finer.";
                    rec.detail = `Your water (${temperature}°C) might be too cool to extract properly. Try 96°C+.`;
                } else {
                    rec.message = "Grind Finer & Hotter Water.";
                }
            }
        }
    }

    // =========================================================
    // SOUR (Under-extracted)
    // =========================================================
    else if (taste === TASTE_PROFILE.SOUR) {
        rec.type = ADJUSTMENT_TYPE.GRIND;
        rec.icon = "lemon";

        // Check Temp for Filter first
        if (isFilter && temperature && temperature < 93) {
            rec.type = ADJUSTMENT_TYPE.TEMP;
            rec.message = "Increase Water Temperature.";
            rec.detail = `Sourness in filter often comes from low temp. You are at ${temperature}°C. Try increasing to 96°C or boiling before grinding finer.`;
            return rec; // Priority exit
        }

        if (goal === TASTE_GOAL.BODY) {
            // Wants Body, but is Sour. 
            // Grind Finer creates body, but might keep it sour if we don't extract enough.
            rec.message = "Grind Finer.";
            rec.detail = "Finer grind increases body and extraction. If that's not enough, increase dose slightly.";
        } else if (goal === TASTE_GOAL.SWEET) {
            // Classic under-extraction fix.
            rec.message = "Grind Finer (or Higher Temp).";
            rec.detail = "Extract more to move from Sour -> Sweet.";
        } else {
            // Default
            rec.message = "Grind Finer.";
            rec.detail = isFilter ? "Use hotter water (or boil) or agitate more." : "Or increase yield slightly.";

            if (hasTime) {
                const t = parseFloat(time);
                if (!isFilter && t < 25) {
                    rec.detail = `Shot was fast (${t}s). Grinding finer is definitely the right move.`;
                }
            }
        }
    }

    // =========================================================
    // BITTER (Over-extracted)
    // =========================================================
    else if (taste === TASTE_PROFILE.BITTER) {
        rec.type = ADJUSTMENT_TYPE.GRIND;
        rec.icon = "chocolate";

        // Check Temp for Filter
        if (isFilter && temperature && temperature >= 96) {
            rec.type = ADJUSTMENT_TYPE.TEMP;
            rec.message = "Decrease Water Temperature.";
            rec.detail = `You are brewing very hot (${temperature}°C). Drop to 90-93°C to reduce bitterness.`;
            return rec;
        }

        if (goal === TASTE_GOAL.ACIDIC) {
            // User wants Acid, has Bitter. Major over-extraction.
            rec.message = "Grind Coarser Immediately.";
            rec.detail = "You are crushing the acidity. Coarsen up significantly and maybe lower the temp.";
        } else if (goal === TASTE_GOAL.BODY) {
            // Wants Body, but is Bitter.
            // Don't grind coarser (loses body), instead Lower Ratio.
            rec.type = ADJUSTMENT_TYPE.RATIO;
            rec.message = "Decrease Yield (Shorter Ratio).";
            rec.detail = "Cut the shot earlier. This keeps the body (texture) but avoids the late bitter compounds.";
        } else {
            // Default
            rec.message = "Grind Coarser.";
            rec.detail = "Extract less to reduce dryness and heavy notes.";

            if (hasTime) {
                const t = parseFloat(time);
                if (!isFilter && t > 35) {
                    rec.detail = `Shot was slow (${t}s). Grinding coarser will speed it up.`;
                }
            }
        }
    }

    // =========================================================
    // HOLLOW (Weak Body)
    // =========================================================
    else if (taste === TASTE_PROFILE.HOLLOW) {
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.icon = "ghost";

        if (goal === TASTE_GOAL.SWEET) {
            // Hollow + wants Sweet = Needs more stuff dissolved properly.
            rec.type = ADJUSTMENT_TYPE.GRIND;
            rec.message = "Grind Finer.";
            rec.detail = "You need more solubility to get sweetness and presence.";
        } else {
            rec.message = "Increase Dose (More Coffee).";
            rec.detail = "More coffee = more body. Keep the same ratio, just scale up.";
        }
    }

    // =========================================================
    // ASTRINGENT (Channeling)
    // =========================================================
    else if (taste === TASTE_PROFILE.ASTRINGENT) {
        rec.type = ADJUSTMENT_TYPE.GRIND;
        rec.icon = "cactus";
        rec.message = "Check for Channeling.";
        rec.detail = "Dryness often comes from uneven flow (channeling). Improve puck prep (WDT).";

        if (goal === TASTE_GOAL.SWEET) {
            rec.message = "Grind Coarser.";
            rec.detail = "You might be grinding too fine, causing channeling which ruins sweetness. Back off a bit.";
        }
    }

    // =========================================================
    else if (taste === TASTE_PROFILE.WEAK) {
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.icon = "water";

        if (goal === TASTE_GOAL.SWEET) {
            // Weak + NOT Sweet usually means under-extracted channel
            rec.type = ADJUSTMENT_TYPE.GRIND;
            rec.message = "Grind Finer.";
            rec.detail = "The coffee is weak because it's not extracting enough. Fine up to get more sugar.";
        } else if (goal === TASTE_GOAL.ACIDIC) {
            rec.message = "Use Less Water (Shorter Ratio).";
            rec.detail = "Concentrate the acids by using less water (e.g. 1:15 ratio).";
        } else {
            // Default / Body
            rec.message = "Increase Dose (More Coffee).";
            rec.detail = "Or you can try grinding finer to extract more strength.";
        }
    }
    else if (taste === TASTE_PROFILE.STRONG) {
        rec.type = ADJUSTMENT_TYPE.RATIO;
        rec.icon = "muscle";

        if (goal === TASTE_GOAL.SWEET || goal === TASTE_GOAL.ACIDIC) {
            // Strong + Bad taste = Over-extracted
            rec.type = ADJUSTMENT_TYPE.GRIND;
            rec.message = "Grind Coarser.";
            rec.detail = "It's strong because it's over-extracting. Coarsen up to clarify the flavor.";
        } else {
            // Just too heavy
            rec.message = "Decrease Dose (Less Coffee).";
            rec.detail = "Or use more water (Longer Ratio) to dilute it.";
        }
    }

    return rec;
}
