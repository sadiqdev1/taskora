const BASE = 'https://taskora.io';

export default function sitemap() {
  const now = new Date().toISOString();

  return [
    { url: `${BASE}/`,          lastModified: now, changeFrequency: 'daily',   priority: 1.0  },
    { url: `${BASE}/tasks`,     lastModified: now, changeFrequency: 'hourly',  priority: 0.9  },
    { url: `${BASE}/register`,  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/login`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/help`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.6  },
  ];
}
