import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import { IoWallet, IoCheckmarkCircle, IoTrendingDown, IoNotifications, IoFlame, IoTrendingUp, IoTime } from 'react-icons/io5';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();

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
      title: 'Total Withdrawals',
      value: formatCurrency(850.00),
      icon: <IoTrendingDown className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: 'Total Earned',
      value: formatCurrency(3420.00),
      icon: <IoTrendingUp className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Welcome back, {user?.name}! <IoFlame className="text-orange-500" size={24} />
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`p-5 border-l-4 ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1 font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
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
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
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
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
