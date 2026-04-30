import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';
import { mockWallet, mockTransactions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoWallet, IoTrendingUp, IoTrendingDown, IoCard, IoAdd, IoTrash, IoPencil, IoSwapHorizontal, IoArrowForward } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Wallet = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Bank Details State
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saving, setSaving] = useState(false);

  // Load bank accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('bankAccounts');
    if (savedAccounts) {
      setBankAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  // Save bank accounts to localStorage whenever they change
  useEffect(() => {
    if (bankAccounts.length > 0) {
      localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    }
  }, [bankAccounts]);

  const handleAddBank = () => {
    if (!bankName || !accountNumber || !accountName) {
      showToast('error', 'Please fill all fields');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newAccount = {
        id: Date.now(),
        bankName,
        accountNumber,
        accountName,
        isDefault: bankAccounts.length === 0,
      };
      const updatedAccounts = [...bankAccounts, newAccount];
      setBankAccounts(updatedAccounts);
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      setSaving(false);
      setShowAddModal(false);
      showToast('success', 'Bank account added successfully!');
    }, 1000);
  };

  const handleEditBank = () => {
    if (!bankName || !accountNumber || !accountName) {
      showToast('error', 'Please fill all fields');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const updatedAccounts = bankAccounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, bankName, accountNumber, accountName }
          : acc
      );
      setBankAccounts(updatedAccounts);
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      setSaving(false);
      setShowEditModal(false);
      setEditingAccount(null);
      showToast('success', 'Bank account updated successfully!');
    }, 1000);
  };

  const handleDeleteBank = (id) => {
    if (bankAccounts.length === 1) {
      showToast('error', 'You must have at least one bank account');
      return;
    }
    const updatedAccounts = bankAccounts.filter(acc => acc.id !== id);
    setBankAccounts(updatedAccounts);
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    showToast('success', 'Bank account deleted successfully!');
  };

  const handleSetDefault = (id) => {
    const updatedAccounts = bankAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    }));
    setBankAccounts(updatedAccounts);
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    showToast('success', 'Default account updated!');
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setBankName(account.bankName);
    setAccountNumber(account.accountNumber);
    setAccountName(account.accountName);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingAccount(null);
    setBankName('');
    setAccountNumber('');
    setAccountName('');
  };

  // Get recent transactions (last 5)
  const recentTransactions = mockTransactions.slice(0, 5);

  const getTransactionIcon = (type) => {
    const icons = {
      earning: <IoTrendingUp size={20} />,
      withdrawal: <IoTrendingDown size={20} />,
      refund: <IoSwapHorizontal size={20} />,
    };
    return icons[type] || <IoSwapHorizontal size={20} />;
  };

  const getTransactionColor = (type) => {
    const colors = {
      earning: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
      withdrawal: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
      refund: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    };
    return colors[type] || 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm opacity-90">Current Balance</p>
              <IoWallet size={20} className="sm:w-6 sm:h-6" />
            </div>
            <p className="text-2x22222l sm:3t3e3x3t3-3xl font-bold mb-2">
              {formatCurrency(mockWallet.balance)}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/withdrawal')}
              className="mt-4 w-full sm:w-auto"
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
          className="hidden md:block"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Total Earnings</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <IoTrendingUp size={16} className="sm:w-5 sm:h-5" />
              </div>
            </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(mockWallet.totalEarnings)}
          </p>
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">All time</p>
        </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4 }}
          className="hidden md:block"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Total Withdrawals</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                <IoTrendingDown size={16} className="sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(mockWallet.totalWithdrawals)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-2">All time</p>
          </Card>
        </motion.div>
      </div>

      {/* Bank Accounts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Bank Accounts
            </h2>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <IoAdd size={18} />
              Add Account
            </Button>
          </div>

          <div className="space-y-3">
            {bankAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 4 }}
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
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                    {!account.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(account.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(account)}
                      >
                        <IoPencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBank(account.id)}
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <IoTrash size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Transactions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-2"
            >
              View All
              <IoArrowForward size={16} />
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/transactions/${transaction.id}`)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTransactionColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-base ${
                      transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <Badge
                      variant={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <IoSwapHorizontal size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
                <p className="text-gray-500 dark:text-zinc-400 text-sm">No transactions yet</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Add Bank Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModals}
        title="Add Bank Account"
      >
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={closeModals}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBank}
              loading={saving}
              className="flex-1"
            >
              Add Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Bank Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Edit Bank Account"
      >
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={closeModals}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditBank}
              loading={saving}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Wallet;
