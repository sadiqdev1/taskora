import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import {
  IoWallet, IoCheckmarkCircle, IoCopy, IoRefresh,
  IoInformationCircle, IoArrowBack, IoCard, IoPhonePortrait,
  IoGlobe, IoTime
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const METHODS = [
  {
    id: 'bank',
    label: 'Bank Transfer',
    desc: 'Transfer directly from your bank',
    icon: <IoCard size={22} />,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/30',
    time: '5–30 mins',
  },
  {
    id: 'ussd',
    label: 'USSD',
    desc: 'Dial a code from any phone',
    icon: <IoPhonePortrait size={22} />,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/30',
    time: 'Instant',
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    desc: 'Pay with Visa, Mastercard, Verve',
    icon: <IoGlobe size={22} />,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/30',
    time: 'Instant',
  },
];

const QUICK_AMOUNTS = [1650, 5000, 10000, 25000, 50000, 100000];

// Mock virtual account details
const VIRTUAL_ACCOUNT = {
  bankName: 'Wema Bank',
  accountNumber: '0123456789',
  accountName: 'TASKORA / ABUBAKAR IBRAHIM',
  reference: `TKR-${Date.now().toString().slice(-8)}`,
};

const Deposit = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1); // 1 = select method, 2 = enter amount, 3 = payment details
  const [method, setMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState('');

  const selectedMethod = METHODS.find(m => m.id === method);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    showToast('success', `${label} copied!`);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleContinue = () => {
    if (step === 1 && !method) {
      showToast('error', 'Please select a payment method');
      return;
    }
    if (step === 2) {
      const amt = parseFloat(amount);
      if (!amt || amt < 1000) {
        showToast('error', 'Minimum deposit is ₦1,000');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      showToast('success', 'Payment confirmed! Your wallet has been credited.');
      setTimeout(() => navigate('/wallet'), 1500);
    }, 2500);
  };

  const progressSteps = ['Method', 'Amount', 'Pay'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 pb-24 md:pb-6 max-w-xl mx-auto"
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/wallet')}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
          >
            <IoArrowBack size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Deposit Funds</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-500">Add money to your Taskora wallet</p>
          </div>
        </div>
      </motion.div>

      {/* Step Progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2">
          {progressSteps.map((label, i) => {
            const stepNum = i + 1;
            const done = step > stepNum;
            const active = step === stepNum;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-green-500 text-white' :
                    active ? 'bg-blue-500 text-white' :
                    'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-500'
                  }`}>
                    {done ? <IoCheckmarkCircle size={16} /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-600'
                  }`}>{label}</span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full ${done ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-700'}`} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Select Method */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Choose payment method</p>
            {METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  method === m.id
                    ? `${m.border} ${m.bg}`
                    : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.bg} ${m.color}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.label}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{m.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-600">
                      <IoTime size={12} />
                      <span>{m.time}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      method === m.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-zinc-600'
                    }`}>
                      {method === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <Button onClick={handleContinue} className="w-full mt-2">
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 2 — Enter Amount */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Selected method badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${selectedMethod?.bg} ${selectedMethod?.color}`}>
              {selectedMethod?.icon}
              {selectedMethod?.label}
            </div>

            {/* Amount input */}
            <Card className="p-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-4">Enter amount</p>
              <div className="relative mb-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400 dark:text-zinc-500">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-600 mb-5">Minimum deposit: ₦1,000</p>

              {/* Quick amounts */}
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">Quick amounts</p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                      amount === amt.toString()
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </Card>

            {/* Summary */}
            {amount && parseFloat(amount) >= 1000 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-4 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-zinc-400">You're depositing</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(parseFloat(amount))}</span>
                  </div>
                </Card>
              </motion.div>
            )}

            <Button onClick={handleContinue} className="w-full">
              Proceed to Payment
            </Button>
          </motion.div>
        )}

        {/* Step 3 — Payment Details */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Amount to pay */}
            <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-80 mb-1">Amount to deposit</p>
              <p className="text-3xl font-bold">{formatCurrency(parseFloat(amount))}</p>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/20`}>
                {selectedMethod?.icon}
                <span>{selectedMethod?.label}</span>
              </div>
            </Card>

            {/* Bank Transfer Details */}
            {method === 'bank' && (
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <IoInformationCircle className="text-blue-500" size={18} />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Transfer to this account</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Bank Name', value: VIRTUAL_ACCOUNT.bankName },
                    { label: 'Account Number', value: VIRTUAL_ACCOUNT.accountNumber, copyable: true },
                    { label: 'Account Name', value: VIRTUAL_ACCOUNT.accountName },
                    { label: 'Amount', value: formatCurrency(parseFloat(amount)) },
                    { label: 'Reference', value: VIRTUAL_ACCOUNT.reference, copyable: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                      <span className="text-xs text-gray-500 dark:text-zinc-500">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                        {item.copyable && (
                          <button
                            onClick={() => handleCopy(item.value, item.label)}
                            className={`p-1 rounded-lg transition-colors ${
                              copied === item.label
                                ? 'text-green-500 bg-green-50 dark:bg-green-500/10'
                                : 'text-gray-400 dark:text-zinc-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                            }`}
                          >
                            {copied === item.label ? <IoCheckmarkCircle size={16} /> : <IoCopy size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    ⚠️ Use the reference number when making the transfer so we can identify your payment.
                  </p>
                </div>
              </Card>
            )}

            {/* USSD Details */}
            {method === 'ussd' && (
              <Card className="p-5">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dial this USSD code</p>
                <div className="text-center py-6">
                  <div className="inline-flex items-center gap-2 px-6 py-4 bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/30 rounded-2xl">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400 tracking-widest">
                      *737*{parseFloat(amount).toFixed(0)}*1#
                    </span>
                    <button
                      onClick={() => handleCopy(`*737*${parseFloat(amount).toFixed(0)}*1#`, 'USSD code')}
                      className="text-green-500 hover:text-green-600 transition"
                    >
                      {copied === 'USSD code' ? <IoCheckmarkCircle size={20} /> : <IoCopy size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-3">GTBank USSD • Works on any phone</p>
                </div>
              </Card>
            )}

            {/* Card Payment */}
            {method === 'card' && (
              <Card className="p-5">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Card details</p>
                <div className="space-y-3">
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" type="text" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Expiry Date" placeholder="MM / YY" type="text" />
                    <Input label="CVV" placeholder="•••" type="password" />
                  </div>
                  <Input label="Cardholder Name" placeholder="Name on card" type="text" />
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-zinc-600">
                  <IoInformationCircle size={14} />
                  <span>Your card details are encrypted and secure</span>
                </div>
              </Card>
            )}

            {/* I've paid / Verify button */}
            <Button onClick={handleVerify} loading={verifying} className="w-full">
              {verifying ? 'Verifying payment...' : "I've Made the Payment"}
            </Button>

            <button
              onClick={() => setStep(2)}
              className="w-full text-center text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition py-2"
            >
              Change amount or method
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Deposit;
