import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  IoRocket, IoCamera, IoPerson, IoCall, IoCard, IoNotifications,
  IoCheckmarkCircle, IoWallet, IoStar, IoTrendingUp, IoArrowForward, IoArrowBack,
} from 'react-icons/io5';

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.25, ease: 'easeIn' } }),
};

// Animated confetti dots for step 1
const ConfettiDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(18)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2.5 h-2.5 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { permission, requestPermission, notify } = useNotifications();
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Profile step state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Bank step state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [savingBank, setSavingBank] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveBank = () => {
    if (!bankName || !accountNumber || !accountName) return;
    setSavingBank(true);
    setTimeout(() => {
      const accounts = JSON.parse(localStorage.getItem('bankAccounts') || '[]');
      accounts.push({ id: Date.now(), bankName, accountNumber, accountName, isDefault: accounts.length === 0 });
      localStorage.setItem('bankAccounts', JSON.stringify(accounts));
      setSavingBank(false);
      setBankSaved(true);
    }, 1000);
  };

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-500">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-xs font-semibold text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ── Step 1: Welcome ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative p-8 text-center overflow-hidden min-h-[420px] flex flex-col items-center justify-center"
              >
                <ConfettiDots />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
                    <IoRocket size={36} className="text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Welcome to Taskora, {user?.name?.split(' ')[0] || 'there'}! 🎉
                  </h1>
                  <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    You're just a few steps away from earning your first reward. Let's set up your account quickly.
                  </p>
                  <Button onClick={goNext} className="w-full flex items-center justify-center gap-2">
                    Let's get started <IoArrowForward size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Profile Setup ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                    <IoPerson size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Setup</h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Tell us a bit about yourself</p>
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=3b82f6&color=fff`}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-zinc-900 object-cover shadow-md"
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition"
                    >
                      <IoCamera size={14} />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">Optional — tap to upload</p>
                </div>

                <div className="space-y-4 mb-6">
                  <Input type="text" label="Full Name" placeholder="Enter your full name" value={fullName} onChange={setFullName} required />
                  <Input type="tel" label="Phone Number" placeholder="+234 000 000 0000" value={phone} onChange={setPhone} />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex items-center gap-1.5">
                    <IoArrowBack size={15} /> Back
                  </Button>
                  <Button onClick={goNext} className="flex-1 flex items-center justify-center gap-2">
                    Continue <IoArrowForward size={16} />
                  </Button>
                </div>
                <button onClick={goNext} className="w-full text-center text-xs text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 mt-3 transition-colors">
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* ── Step 3: Add Bank Account ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                    <IoCard size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Bank Account</h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Required for withdrawals</p>
                  </div>
                </div>

                {bankSaved ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mb-3">
                      <IoCheckmarkCircle size={32} className="text-green-500" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Bank account saved!</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6">{bankName} — {accountNumber}</p>
                    <Button onClick={goNext} className="w-full flex items-center justify-center gap-2">
                      Continue <IoArrowForward size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <Input type="text" label="Bank Name" placeholder="e.g. Access Bank" value={bankName} onChange={setBankName} required />
                      <Input type="text" label="Account Number" placeholder="10-digit account number" value={accountNumber} onChange={setAccountNumber} required />
                      <Input type="text" label="Account Holder Name" placeholder="Name on account" value={accountName} onChange={setAccountName} required />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={goBack} className="flex items-center gap-1.5">
                        <IoArrowBack size={15} /> Back
                      </Button>
                      <Button
                        onClick={handleSaveBank}
                        loading={savingBank}
                        disabled={!bankName || !accountNumber || !accountName}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        Save Account
                      </Button>
                    </div>
                    <button onClick={goNext} className="w-full text-center text-xs text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 mt-3 transition-colors">
                      Skip for now
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Step 4: Enable Notifications ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <IoNotifications size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enable Notifications</h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Stay updated on your tasks</p>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${
                  permission === 'granted'
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                    : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      permission === 'granted'
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      <IoNotifications size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {permission === 'granted' ? 'Push notifications enabled' : 'Enable push notifications'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">
                        {permission === 'granted' ? 'You will receive real-time alerts' : 'Get notified about tasks and payments'}
                      </p>
                    </div>
                  </div>
                  {permission === 'granted' ? (
                    <button
                      onClick={() => notify('Test notification', { body: 'Push notifications are working!' })}
                      className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
                    >
                      Test
                    </button>
                  ) : permission === 'denied' ? (
                    <span className="text-xs text-red-500 font-medium">Blocked</span>
                  ) : (
                    <Button size="sm" onClick={requestPermission}>Enable</Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex items-center gap-1.5">
                    <IoArrowBack size={15} /> Back
                  </Button>
                  <Button onClick={goNext} className="flex-1 flex items-center justify-center gap-2">
                    Continue <IoArrowForward size={16} />
                  </Button>
                </div>
                <button onClick={goNext} className="w-full text-center text-xs text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 mt-3 transition-colors">
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* ── Step 5: All Done ── */}
            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-5"
                >
                  <IoCheckmarkCircle size={40} className="text-green-500" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're all set! 🚀</h2>
                <p className="text-gray-600 dark:text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
                  Your account is ready. Start completing tasks and earning rewards right away.
                </p>

                {/* Stats preview */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Tasks', value: '500+', icon: <IoCheckmarkCircle size={16} />, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
                    { label: 'Avg Earn', value: '₦250', icon: <IoWallet size={16} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'Rating', value: '4.8★', icon: <IoStar size={16} />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                      <div className={`${s.color} flex justify-center mb-1`}>{s.icon}</div>
                      <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center gap-2">
                  Go to Dashboard <IoArrowForward size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
