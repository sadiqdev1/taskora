import { Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoWallet, IoTrophy, IoRocket, IoShield, IoTrendingUp } from 'react-icons/io5';

const Welcome = () => {
  const features = [
    {
      icon: <IoRocket className="w-6 h-6" />,
      title: 'Easy Tasks',
      description: 'Complete simple social media tasks and earn rewards instantly'
    },
    {
      icon: <IoWallet className="w-6 h-6" />,
      title: 'Quick Payouts',
      description: 'Withdraw your earnings anytime with multiple payment options'
    },
    {
      icon: <IoTrophy className="w-6 h-6" />,
      title: 'Earn More',
      description: 'Complete more tasks and increase your earnings daily'
    },
    {
      icon: <IoShield className="w-6 h-6" />,
      title: 'Secure Platform',
      description: 'Your data and earnings are protected with top-tier security'
    },
    {
      icon: <IoTrendingUp className="w-6 h-6" />,
      title: 'Track Progress',
      description: 'Monitor your earnings and task completion in real-time'
    },
    {
      icon: <IoCheckmarkCircle className="w-6 h-6" />,
      title: 'Verified Tasks',
      description: 'All tasks are verified and legitimate opportunities'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '₦82M+', label: 'Paid Out' },
    { value: '5K+', label: 'Tasks Completed' },
    { value: '4.8/5', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-zinc-950 dark:via-zinc-900 dark:to-primary/5">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Taskora</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all hover:shadow-md hover:shadow-primary/25 active:scale-[.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-primary">Start earning today</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Turn Your Time Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Real Money
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Complete simple social media tasks, earn rewards, and get paid instantly. 
            Join thousands of users already making money with Taskora.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[.98] flex items-center justify-center gap-2"
            >
              <IoRocket className="w-5 h-5" />
              Start Earning Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all active:scale-[.98]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Taskora?
          </h2>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to start earning money online with simple tasks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start earning in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sign Up Free
            </h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Create your account in seconds. No credit card required.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Complete Tasks
            </h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Browse available tasks and complete them at your own pace.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Get Paid
            </h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Withdraw your earnings instantly to your preferred payment method.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center shadow-2xl shadow-primary/20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making money with Taskora
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-gray-50 rounded-xl transition-all hover:shadow-lg active:scale-[.98]"
          >
            <IoRocket className="w-5 h-5" />
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Taskora</span>
              </div>
              <p className="text-gray-600 dark:text-zinc-400 text-sm max-w-md">
                The easiest way to earn money online by completing simple social media tasks. 
                Start your earning journey today.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                <li><Link to="/tasks" className="hover:text-primary transition-colors">Browse Tasks</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/wallet" className="hover:text-primary transition-colors">Wallet</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-zinc-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-zinc-400">
            <p>&copy; {new Date().getFullYear()} Taskora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
