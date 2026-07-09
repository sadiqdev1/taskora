import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #1a1040 0%, #2d1b6e 50%, #1a1040 100%)',
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', padding: 80,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #6C5CE7, #8B7CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 36, fontWeight: 900,
          }}>T</div>
          <span style={{ color: 'white', fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>Taskora</span>
        </div>
        {/* Headline */}
        <h1 style={{
          color: 'white', fontSize: 64, fontWeight: 900,
          textAlign: 'center', lineHeight: 1.1, letterSpacing: -2,
          margin: 0, marginBottom: 24,
        }}>
          Get paid for what you<br />
          <span style={{ color: '#A29BFE' }}>already do online.</span>
        </h1>
        {/* Sub */}
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 28, textAlign: 'center', margin: 0, marginBottom: 48 }}>
          Complete social media tasks. Earn real cash. Withdraw anytime.
        </p>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[['50K+', 'Earners'], ['₦2.1B', 'Paid Out'], ['500+', 'Live Tasks']].map(([v, l]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#A29BFE', fontSize: 36, fontWeight: 900 }}>{v}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
