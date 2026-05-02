import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { IoWallet, IoCard, IoCheckmarkCircle, IoInformationCircle, IoArrowBack, IoPencil, IoTrash, IoAdd } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Withdrawal = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('withdraw');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  // Bank Accounts from Wallet page (using localStorage for demo)
  const [bankAccounts, setBankAccounts] = useState([]);

  const mockWalletBalance = 2063325;

  // Load bank accounts from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem('bankAccounts');
    if (savedAccounts) {
      setBankAccounts(JSON.parse(savedAccounts));
    }
  }, [activeTab]); // Reload when switching tabs

  const withdrawMethods = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'crypto', label: 'Cryptocurrency' },
  ];

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawMethod) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 16500) {
      showToast('Minimum withdrawal amount is ₦16,500', 'error');
      return;
    }

    if (amount > mockWalletBalance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setWithdrawAmount('');
      setWithdrawMethod('');
      showToast('Withdrawal request submitted successfully!', 'success');
      setTimeout(() => navigate('/wallet'), 1500);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Withdrawal
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Request withdrawals and manage payment methods
        </p>
      </motion.div>

      {/* Available Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">Available Balance</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(mockWalletBalance)}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <IoWallet size={24} className="sm:w-8 sm:h-8" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              <IoWallet className="inline mr-2" />
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('bank-details')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'bank-details'
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              <IoCard className="inline mr-2" />
              Bank Details
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'withdraw' ? (
        <motion.div
          key="withdraw"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Request Withdrawal
            </h2>

            <div className="space-y-4">
              <Input
                type="number"
                label="Withdrawal Amount"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={setWithdrawAmount}
                required
              />

              <Dropdown
                label="Payment Method"
                value={withdrawMethod}
                onChange={setWithdrawMethod}
                options={withdrawMethods}
                placeholder="Select payment method"
              />

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <div className="flex gap-3">
                  <IoInformationCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-gray-600 dark:text-zinc-400">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">Withdrawal Information</p>
                    <ul className="space-y-1">
                      <li>• Minimum withdrawal: ₦16,500</li>
                      <li>• Processing time: 1-3 business days</li>
                      <li>• No withdrawal fees</li>
                      <li>• Withdrawals are processed Monday-Friday</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Quick Amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[82500, 165000, 412500, 825000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setWithdrawAmount(amount.toString())}
                      disabled={amount > mockWalletBalance}
                      className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                        withdrawAmount === amount.toString()
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                      } ${
                        amount > mockWalletBalance
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/wallet')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  loading={processing}
                  className="flex-1"
                >
                  <IoCheckmarkCircle className="mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="bank-details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Saved Bank Accounts
              </h2>
              <Button
                size="sm"
                onClick={() => navigate('/wallet')}
                className="flex items-center gap-2"
              >
                <IoAdd size={18} />
                Add Account
              </Button>
            </div>

            {bankAccounts.length === 0 ? (
              <EmptyState
                icon={<IoCard size={48} />}
                title="No Bank Accounts"
                description="You haven't added any bank accounts yet. Add a bank account in your Wallet to receive withdrawals."
                action={
                  <Button onClick={() => navigate('/wallet')}>
                    <IoAdd className="mr-2" />
                    Add Bank Account
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {bankAccounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IoCard size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {account.bankName}
                            </p>
                            {account.isDefault && (
                              <Badge variant="success" size="sm">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                            {account.accountName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-zinc-500">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <div className="flex gap-3">
                    <IoInformationCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-gray-600 dark:text-zinc-400">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Withdrawal Information</p>
                      <p>Withdrawals will be sent to your default bank account. To add, edit, or change your default account, please visit your Wallet page.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Withdrawal;
