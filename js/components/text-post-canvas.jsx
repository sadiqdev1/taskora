/**
 * TextPostCanvas — renders a text post as a styled HTML/CSS card.
 * Used in meme cards instead of an <img> when post_type === 'text'.
 * Emojis, unicode, and all characters render perfectly.
 */
export default function TextPostCanvas({ textContent, textStyle, className = '' }) {
    const style = textStyle ?? {};

    const bg = style.background_color ?? style.backgroundColor ?? '#3b82f6';
    const borderRadius = style.border_radius ?? style.borderRadius ?? '16px';
    const fontFamily = style.font_family ?? style.fontFamily ?? 'Arial, sans-serif';
    const fontSize = style.font_size ?? style.fontSize ?? 32;
    const fontWeight = style.font_weight ?? style.fontWeight ?? 'normal';
    const fontStyle = style.font_style ?? style.fontStyle ?? 'normal';
    const textAlign = style.text_align ?? style.textAlign ?? 'center';

    // Auto text color based on background brightness
    let textColor = '#ffffff';
    const isGradient = bg.includes('gradient') || bg.includes('linear') || bg.includes('radial');
    if (!isGradient) {
        const hex = bg.replace('#', '');
        if (hex.length === 6) {
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            textColor = (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#000000' : '#ffffff';
        }
    }

    return (
        <div
            className={`w-full flex items-center justify-center overflow-hidden ${className}`}
            style={{
                background: bg,
                borderRadius,
                aspectRatio: '4/3',
            }}
        >
            <p
                style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    fontStyle,
                    textAlign,
                    color: textColor,
                    lineHeight: 1.4,
                    padding: '2rem 2.5rem',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                }}
            >
                {textContent}
            </p>
        </div>
    );
}
