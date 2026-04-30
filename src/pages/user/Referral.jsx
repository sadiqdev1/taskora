import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoCopy,
  IoCheckmark,
  IoPeople,
  IoGift,
  IoShareSocial,
  IoTrendingUp,
  IoLink,
} from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';

// Derive a referral code from the user id
const getReferralCode = (user) =>
  `TASKORA-${(user?.name ?? 'USER').split(' ')[0].toUpperCase()}-${(user?.id ?? '1').toString().padStart(4, '0')}`;

const mockReferralStats = {
  totalReferred: 12,
  pendingRewards: 3,
  totalEarned: 240.0,
  rewardPerReferral: 20.0,
};

const mockReferrals = [
  { id: 1, name: 'Fatima Yusuf',   avatar: 'https://ui-avatars.com/api/?name=Fatima+Yusuf&background=ec4899&color=fff',   status: 'active',  earned: 20,  joinedAt: '2 days ago'  },
  { id: 2, name: 'Emeka Okafor',   avatar: 'https://ui-avatars.com/api/?name=Emeka+Okafor&background=10b981&color=fff',   status: 'active',  earned: 20,  joinedAt: '5 days ago'  },
  { id: 3, name: 'Amina Bello',    avatar: 'https://ui-avatars.com/api/?name=Amina+Bello&background=f59e0b&color=fff',    status: 'pending', earned: 0,   joinedAt: '1 week ago'  },
  { id: 4, name: 'Chidi Nwosu',    avatar: 'https://ui-avatars.com/api/?name=Chidi+Nwosu&background=8b5cf6&color=fff',    status: 'active',  earned: 20,  joinedAt: '2 weeks ago' },
  { id: 5, name: 'Zainab Musa',    avatar: 'https://ui-avatars.com/api/?name=Zainab+Musa&background=3b82f6&color=fff',    status: 'pending', earned: 0,   joinedAt: '3 weeks ago' },
];

export default function Referral() {
  const { user } = useAuth();
  const referralCode = getReferralCode(user);
  const referralLink = `https://taskora.com/register?ref=${referralCode}`;

  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copy = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // fallback — select + execCommand
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Taskora',
          text: `Join Taskora and start earning! Use my referral code ${referralCode}`,
          url: referralLink,
        });
        return;
      } catch {}
    }
    copy(referralLink, setLinkCopied);
  };

  const stats = [
    { label: 'Total Referred',    value: mockReferralStats.totalReferred,                       icon: IoPeople,     color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10'   },
    { label: 'Total Earned',      value: formatCurrency(mockReferralStats.totalEarned),          icon: IoTrendingUp, color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-500/10' },
    { label: 'Reward / Referral', value: formatCurrency(mockReferralStats.rewardPerReferral),    icon: IoGift,       color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Pending Rewards',   value: mockReferralStats.pendingRewards,                       icon: IoGift,       color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">Refer Friends</h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Earn {formatCurrency(mockReferralStats.rewardPerReferral)} for every friend who joins and completes their first task.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3"
      >
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Referral code + link */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">Your Referral Code</p>

          {/* Code row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-dashed border-gray-300 dark:border-zinc-600 rounded-xl px-4 py-3 text-center">
              <span className="text-lg font-bold tracking-widest text-blue-600 dark:text-blue-400 select-all">
                {referralCode}
              </span>
            </div>
            <button
              onClick={() => copy(referralCode, setCodeCopied)}
              className={`flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                codeCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {codeCopied ? <IoCheckmark size={16} /> : <IoCopy size={16} />}
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Link row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 min-w-0">
              <IoLink size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">{referralLink}</span>
            </div>
            <button
              onClick={() => copy(referralLink, setLinkCopied)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                linkCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-600'
              }`}
            >
              {linkCopied ? <IoCheckmark size={14} /> : <IoCopy size={14} />}
              {linkCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Share button */}
          <button
            onClick={shareNative}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold transition-all active:scale-[.98]"
          >
            <IoShareSocial size={17} />
            Share with Friends
          </button>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-3">How it works</p>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Share your referral code or link with friends.' },
              { step: '2', text: 'They sign up using your code and complete their first task.' },
              { step: '3', text: `You earn ${formatCurrency(mockReferralStats.rewardPerReferral)} credited to your wallet automatically.` },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Referred users list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
              Your Referrals
            </p>
            <span className="text-xs text-gray-400 dark:text-zinc-500">{mockReferrals.length} total</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {mockReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center gap-3 px-4 py-3">
                <img src={ref.avatar} alt={ref.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{ref.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500">{ref.joinedAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    ref.status === 'active'
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {ref.status === 'active' ? 'Earned' : 'Pending'}
                  </span>
                  {ref.earned > 0 && (
                    <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      +{formatCurrency(ref.earned)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
