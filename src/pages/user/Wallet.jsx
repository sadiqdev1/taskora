import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { mockWallet, mockTransactions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoWallet, IoTrendingUp, IoTrendingDown, IoCash } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Wallet = () => {
  const { showToast } = useToast();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const withdrawMethods = [
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank', label: 'Bank Transfer' },
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

    if (amount > mockWallet.balance) {
      showToast('error', 'Insufficient balance');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawMethod('');
      showToast('success', 'Withdrawal request submitted successfully!');
    }, 1500);
  };

  const getTransactionIcon = (type) => {
    return type === 'earning' ? <IoTrendingUp /> : <IoTrendingDown />;
  };

  const getTransactionColor = (type) => {
    return type === 'earning' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
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
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your earnings and withdrawals
        </p>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm opacity-90">Current Balance</p>
              <IoWallet size={24} />
            </div>
            <p className="text-4xl font-bold mb-2">
              {formatCurrency(mockWallet.balance)}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWithdrawModal(true)}
              className="mt-4"
            >
              Withdraw Funds
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400">Total Earnings</p>
              <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <IoTrendingUp size={20} />
              </div>
            </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(mockWallet.totalEarnings)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">All time</p>
        </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400">Total Withdrawals</p>
              <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                <IoTrendingDown size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(mockWallet.totalWithdrawals)}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">All time</p>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {mockTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'earning' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'} size="sm">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <p className="text-sm text-gray-600 dark:text-zinc-400">Available Balance</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(mockWallet.balance)}
            </p>
          </div>

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

          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              • Minimum withdrawal: $10<br />
              • Processing time: 1-3 business days<br />
              • No withdrawal fees
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              loading={processing}
              className="flex-1"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Wallet;
