'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle2, Megaphone, ArrowUpRight, Users, Bell, ShieldCheck, AlertCircle } from 'lucide-react';

const NOTIF_META = {
  earning:    { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  campaign:   { Icon: Megaphone,    bg: '#EEF2FF', color: 'var(--primary)' },
  withdrawal: { Icon: ArrowUpRight, bg: '#E0F0FF', color: '#0369A1' },
  referral:   { Icon: Users,        bg: '#FFF3D6', color: '#B45309' },
  system:     { Icon: ShieldCheck,  bg: '#F0EEFF', color: '#6C5CE7' },
  default:    { Icon: Bell,         bg: '#F5F5F5', color: '#666'    },
};

const NOTIFICATIONS = [
  { id: 1, type: 'earning',    title: 'Task Approved!',          body: 'Your Instagram Post Engagement task was approved. You earned $3.00.',    time: '2 hours ago',  read: false },
  { id: 2, type: 'campaign',   title: 'New Campaign Available',  body: 'A new TikTok campaign just launched. $4.00 per task, 50 slots available.', time: '3 hours ago',  read: false },
  { id: 3, type: 'withdrawal', title: 'Withdrawal Processed',    body: 'Your $300 withdrawal has been sent to your PayPal account.',              time: '5 hours ago',  read: false },
  { id: 4, type: 'referral',   title: 'Referral Bonus Earned',   body: 'Your referral Eva Martinez signed up. You earned $5.00 bonus!',           time: '1 day ago',    read: true  },
  { id: 5, type: 'earning',    title: 'Task Approved!',          body: 'Your YouTube Channel Boost task was approved. You earned $4.00.',         time: '1 day ago',    read: true  },
  { id: 6, type: 'system',     title: 'Account Verified',        body: 'Your account has been verified. You can now withdraw without limits.',    time: '2 days ago',   read: true  },
  { id: 7, type: 'campaign',   title: 'Campaign Completed',      body: 'The Facebook Page Like campaign you joined has been completed.',          time: '3 days ago',   read: true  },
  { id: 8, type: 'earning',    title: 'Task Approved!',          body: 'Your Twitter Post Engagement task was approved. You earned $2.50.',       time: '4 days ago',   read: true  },
];

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <DashboardLayout title="Notifications" subtitle={`${unread} unread notifications`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">

        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
            <Bell size={11} strokeWidth={2.5} />
            {unread} unread
          </span>
          <button className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
            Mark all as read
          </button>
        </div>

        {NOTIFICATIONS.map(n => {
          const m = NOTIF_META[n.type] || NOTIF_META.default;
          return (
            <div key={n.id}
              className="card rounded-2xl p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer"
              style={!n.read ? { borderLeft: '3px solid var(--primary)', background: 'var(--primary-muted)' } : {}}>
              <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: m.bg, color: m.color }}>
                <m.Icon size={18} strokeWidth={1.9} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{n.title}</p>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--primary)' }} />
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
