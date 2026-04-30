import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { IoWallet, IoCheckmarkCircle, IoTrendingDown, IoTrendingUp, IoTime, IoList } from 'react-icons/io5';
import { formatCurrency } from '../../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Earnings Line Chart Data
  const earningsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Earned',
        data: [45, 78, 120, 95, 150, 88, 110],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Withdrawn',
        data: [0, 50, 0, 100, 0, 75, 0],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Task Completion Bar Chart Data
  const taskChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: isDark ? '#a1a1aa' : '#6b7280',
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#27272a' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#a1a1aa' : '#6b7280',
        borderColor: isDark ? '#3f3f46' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': $' + context.parsed.y;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#71717a' : '#9ca3af',
          font: {
            size: 11,
          },
        },
        border: {
          color: isDark ? '#3f3f46' : '#e5e7eb',
        },
      },
      y: {
        grid: {
          color: isDark ? '#27272a' : '#f3f4f6',
        },
        ticks: {
          color: isDark ? '#71717a' : '#9ca3af',
          font: {
            size: 11,
          },
          callback: function(value) {
            return '$' + value;
          }
        },
        border: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y + ' tasks';
          }
        }
      },
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value) {
            return value;
          }
        },
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Hero Wallet Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          {/* Wallet Balance & Withdraw Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
              <p className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
                {formatCurrency(1250.50)}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/withdrawal')}
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                <IoWallet className="mr-2" />
                Withdraw
              </Button>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 mb-6"></div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            <div>
              <p className="text-xs opacity-75 mb-1">Total Earned</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(3420.00)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Withdrawn</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(850.00)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Tasks Completed</p>
              <p className="text-lg sm:text-2xl font-bold">45</p>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium">Today's Progress</p>
              <p className="text-xs sm:text-sm font-bold">80%</p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="bg-white rounded-full h-2"
              ></motion.div>
            </div>
            <p className="text-xs opacity-75">16 / 20 tasks completed</p>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              onClick={() => navigate('/tasks')}
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3">
                <IoList size={24} />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Browse Tasks</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Find new tasks</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="p-4 cursor-pointer hover:border-green-300 dark:hover:border-green-500 transition-colors"
              onClick={() => navigate('/my-tasks')}
            >
              <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-3">
                <IoCheckmarkCircle size={24} />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">My Tasks</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">View progress</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="p-4 cursor-pointer hover:border-orange-300 dark:hover:border-orange-500 transition-colors"
              onClick={() => navigate('/withdrawal')}
            >
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-3">
                <IoTrendingDown size={24} />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Withdraw</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Cash out now</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="p-4 cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-colors"
              onClick={() => navigate('/transactions')}
            >
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-3">
                <IoTrendingUp size={24} />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Transactions</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">View history</p>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Earnings Overview
            </h2>
            <div className="h-[300px]">
              <Line data={earningsChartData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        {/* Task Completion Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Task Completion Trend
            </h2>
            <div className="h-[300px]">
              <Bar data={taskChartData} options={barChartOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20"
            >
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  Task Approved
                </p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">
                  Download and rate our app - Earned $12.00
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">2h ago</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20"
            >
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <IoTime className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  Task Submitted
                </p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">
                  Share our Instagram post - Under review
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">5h ago</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20"
            >
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <IoWallet className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  Payment Received
                </p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">
                  Withdrawal processed - $50.00 sent to your account
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">1d ago</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
