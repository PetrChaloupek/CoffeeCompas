import React from 'react';

export const Icon = ({ name, className = "icon-svg" }) => {
    const commonProps = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    // For result visuals that need to be "big" and might have different stroke widths
    if (className.includes('big')) {
        commonProps.strokeWidth = "1.5";
    }

    // Define your paths here. 
    // You can replace the content of any case with your own SVG paths.
    switch (name) {
        // TASTES
        case 'sour':
        case 'acidic':
        case 'lemon': // Mapped result icon
            return (
                <svg {...commonProps}>
                    {/* Triangle */}
                    <path d="M12 4L4 20h16z" />
                </svg>
            );

        case 'bitter':
        case 'body':
        case 'chocolate': // Mapped result icon
            return (
                <svg {...commonProps}>
                    {/* Square */}
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" stroke="none" style={{ opacity: 0.2 }} />
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
            );

        case 'salty':
        case 'salt':
            return (
                <svg {...commonProps}>
                    {/* Diamond */}
                    <rect x="12" y="2" width="0" height="0" />
                    <path d="M12 2 2 12 12 22 22 12 12 2z" />
                </svg>
            );

        case 'astringent':
        case 'cactus':
            return (
                <svg {...commonProps}>
                    {/* Zigzag */}
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            );

        case 'weak':
        case 'water':
            return (
                <svg {...commonProps}>
                    {/* Circle Stroke */}
                    <circle cx="12" cy="12" r="9" />
                </svg>
            );

        case 'strong':
        case 'muscle':
            return (
                <svg {...commonProps}>
                    {/* Circle Fill */}
                    <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'hollow':
        case 'ghost':
            return (
                <svg {...commonProps}>
                    {/* Dashed Circle */}
                    <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
                </svg>
            );

        case 'sweet':
            return (
                <svg {...commonProps}>
                    {/* Smooth Circle */}
                    <circle cx="12" cy="12" r="9" />
                </svg>
            );

        case 'fix':
            return (
                <svg {...commonProps}>
                    {/* Plus Sign */}
                    <path d="M12 5v14M5 12h14" />
                </svg>
            );

        case 'magic':
            return (
                <svg {...commonProps}>
                    {/* Star/Sparkle */}
                    <path d="M12 2l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
                </svg>
            );

        // Default / Generic Advice
        default:
            return (
                <svg {...commonProps}>
                    {/* Simple Cup */}
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
            );
    }
};
