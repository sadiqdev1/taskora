import { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Dropdown from '../../components/common/Dropdown';
import Pagination from '../../components/common/Pagination';
import { mockTransactions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoTrendingUp, IoTrendingDown, IoSwapHorizontal } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Transactions = () => {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'earning', label: 'Earnings' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'refund', label: 'Refunds' },
  ];

  const filteredTransactions = filter === 'all'
    ? mockTransactions
    : mockTransactions.filter(t => t.type === filter);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

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
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          View all your transaction history
        </p>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="max-w-xs">
            <Dropdown
              label="Filter by Type"
              value={filter}
              onChange={setFilter}
              options={filterOptions}
            />
          </div>
        </Card>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    Description
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <td className="py-4 px-2 sm:px-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                    </td>
                    <td className="py-4 px-2 sm:px-4">
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        ID: {transaction.id}
                      </p>
                    </td>
                    <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-4 px-2 sm:px-4">
                      <Badge
                        variant={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 sm:px-4 text-right">
                      <p className={`font-bold text-base sm:text-lg ${
                        transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Transactions;
