import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { IoWallet, IoCard, IoCheckmarkCircle, IoInformationCircle, IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Withdrawal = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('withdraw');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  // Bank Details State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [savingBankDetails, setSavingBankDetails] = useState(false);

  const mockWalletBalance = 1250.50;

  const withdrawMethods = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'crypto', label: 'Cryptocurrency' },
  ];

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawMethod) {
      showToast('error', 'Please fill all fields');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 10) {
      showToast('error', 'Minimum withdrawal amount is $10');
      return;
    }

    if (amount > mockWalletBalance) {
      showToast('error', 'Insufficient balance');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setWithdrawAmount('');
      setWithdrawMethod('');
      showToast('success', 'Withdrawal request submitted successfully!');
      setTimeout(() => navigate('/wallet'), 1500);
    }, 1500);
  };

  const handleSaveBankDetails = () => {
    if (!bankName || !accountNumber || !accountName) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    setSavingBankDetails(true);
    setTimeout(() => {
      setSavingBankDetails(false);
      showToast('success', 'Bank details saved successfully!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <IoArrowBack />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Withdraw Funds
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Request a withdrawal or manage your bank details
          </p>
        </div>
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
              <p className="text-3xl sm:text-4xl font-bold">{formatCurrency(mockWalletBalance)}</p>
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
                      <li>• Minimum withdrawal: $10</li>
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
                  {[50, 100, 250, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawAmount(amount.toString())}
                      disabled={amount > mockWalletBalance}
                    >
                      ${amount}
                    </Button>
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Bank Account Details
            </h2>

            <div className="space-y-4">
              <Input
                type="text"
                label="Bank Name"
                placeholder="Enter bank name"
                value={bankName}
                onChange={setBankName}
                required
              />

              <Input
                type="text"
                label="Account Number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={setAccountNumber}
                required
              />

              <Input
                type="text"
                label="Account Holder Name"
                placeholder="Enter account holder name"
                value={accountName}
                onChange={setAccountName}
                required
              />

              <Input
                type="text"
                label="Routing Number (Optional)"
                placeholder="Enter routing number"
                value={routingNumber}
                onChange={setRoutingNumber}
              />

              {/* Security Notice */}
              <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                <div className="flex gap-3">
                  <IoCheckmarkCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-gray-600 dark:text-zinc-400">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">Secure & Encrypted</p>
                    <p>Your bank details are encrypted and stored securely. We never share your information with third parties.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBankName('');
                    setAccountNumber('');
                    setAccountName('');
                    setRoutingNumber('');
                  }}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSaveBankDetails}
                  loading={savingBankDetails}
                  className="flex-1"
                >
                  <IoCheckmarkCircle className="mr-2" />
                  Save Details
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Withdrawal;
