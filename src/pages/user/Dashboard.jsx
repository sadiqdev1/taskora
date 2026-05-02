import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { IoWallet, IoCheckmarkCircle, IoTrendingUp, IoTime, IoAdd, IoArrowDown } from 'react-icons/io5';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6 pb-24 md:pb-6"
    >
      {/* Welcome + Funding Balance Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full" />
          <div className="absolute -right-4 top-20 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative z-10">
            {/* Welcome */}
            <p className="text-sm opacity-80 mb-0.5">Welcome Back!</p>
            <h2 className="text-xl font-bold mb-6 truncate">{user?.name}</h2>

            {/* Funding Balance */}
            <p className="text-xs opacity-75 uppercase tracking-widest mb-1">Funding Balance</p>
            <p className="text-3xl sm:text-4xl font-bold mb-6">
              {formatCurrency(2063325)}
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/create-task')}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <IoAdd size={18} />
                Create Task
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/wallet')}
                className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors border border-white/30"
              >
                <IoArrowDown size={18} />
                Fund Balance
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="relative p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-2xl border border-yellow-200 dark:border-yellow-500/20">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-yellow-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <IoTime size={22} />
            </div>
            <div className="flex-1 w-full min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Complete Your Account Setup
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mb-2">
                Activate your plan to unlock all features and start earning more
              </p>
              <div className="w-full bg-yellow-200 dark:bg-yellow-900/30 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="bg-yellow-600 dark:bg-yellow-500 rounded-full h-2"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">25% Complete</p>
            </div>
            <Button size="sm" onClick={() => navigate('/settings')} className="flex-shrink-0">
              Activate Plan
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats: Pending, Affiliate, Daily Tasks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Pending', value: 528825, icon: <IoTime size={20} />, color: 'yellow' },
          { label: 'Affiliate', value: 0, icon: <IoTrendingUp size={20} />, color: 'cyan' },
          { label: 'Daily Tasks', value: 0, icon: <IoCheckmarkCircle size={20} />, color: 'green' },
        ].map((stat, i) => {
          const colorMap = {
            yellow: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
            cyan:   'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
            green:  'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
          };
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[stat.color]}`}>
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{stat.label}</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {formatCurrency(stat.value)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-2">
            {[
              {
                icon: <IoCheckmarkCircle className="w-5 h-5" />,
                bg: 'bg-green-500',
                wrap: 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20',
                title: 'Task Approved',
                desc: 'Download and rate our app — Earned ₦19,800',
                time: '2h ago',
              },
              {
                icon: <IoTime className="w-5 h-5" />,
                bg: 'bg-orange-500',
                wrap: 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20',
                title: 'Task Submitted',
                desc: 'Share our Instagram post — Under review',
                time: '5h ago',
              },
              {
                icon: <IoWallet className="w-5 h-5" />,
                bg: 'bg-blue-500',
                wrap: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
                title: 'Payment Received',
                desc: 'Withdrawal processed — ₦82,500 sent to your account',
                time: '1d ago',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${item.wrap}`}
              >
                <div className={`w-9 h-9 ${item.bg} text-white rounded-full flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{item.desc}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
