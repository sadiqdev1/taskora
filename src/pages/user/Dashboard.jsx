import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import { IoWallet, IoCheckmarkCircle, IoTrendingDown, IoNotifications, IoFlame, IoTrendingUp, IoTime } from 'react-icons/io5';
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    {
      title: 'Wallet Balance',
      value: formatCurrency(1250.50),
      icon: <IoWallet className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Tasks Completed',
      value: '45',
      icon: <IoCheckmarkCircle className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Total Earned',
      value: formatCurrency(3420.00),
      icon: <IoTrendingUp className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Total Withdrawals',
      value: formatCurrency(850.00),
      icon: <IoTrendingDown className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

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
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Welcome back, {user?.name}! <IoFlame className="text-orange-500" size={24} />
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className={`p-5 border-l-4 ${stat.borderColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <motion.div 
                  className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

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
