'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth]     = useState(0);

  useEffect(() => {
    setVisible(true);
    setWidth(30);
    const t1 = setTimeout(() => setWidth(70),  80);
    const t2 = setTimeout(() => setWidth(90),  200);
    const t3 = setTimeout(() => setWidth(100), 400);
    const t4 = setTimeout(() => { setVisible(false); setWidth(0); }, 550);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px]" style={{ background: 'transparent' }}>
      <div
        className="h-full transition-all duration-200 ease-out"
        style={{
          width: `${width}%`,
          background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
          boxShadow: '0 0 8px var(--primary)',
        }}
      />
    </div>
  );
}
