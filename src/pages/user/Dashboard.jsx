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
      className="space-y-4 sm:space-y-6"
    >
      {/* Hero Wallet Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-5 top-20 w-32 h-32 bg-white/10 rounded-full"></div>
          
          <div className="relative z-10">
            {/* Available Balance & Withdraw Button */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-sm opacity-90 mb-2">Available Balance</p>
                <p className="text-4xl sm:text-5xl font-bold">
                  {formatCurrency(1250.50)}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/withdrawal')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Withdraw
                </Button>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm opacity-75 mb-1">Total Earned</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(3420.00)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm opacity-75 mb-1">Total Withdrawn</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(850.00)}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Incomplete Account
              </h3>
              <div className="mb-2">
                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-yellow-500 rounded-full h-2"
                  ></motion.div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">25% Complete</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/settings')}
              className="ml-4"
            >
              Activate Plan
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Affiliate & Daily Tasks Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoTrendingUp size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Affiliate</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {formatCurrency(0.00)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <Card className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircle size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Daily Tasks</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {formatCurrency(0.00)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Connect & Refer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ y: -4 }}
      >
        <Card 
          className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-zinc-900 dark:to-zinc-800 text-white cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <IoTrendingUp size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Connect</h3>
              <p className="text-base font-semibold">Refer Friends</p>
            </div>
          </div>
        </Card>
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
