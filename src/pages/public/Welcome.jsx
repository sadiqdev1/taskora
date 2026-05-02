import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoRocket, IoWallet, IoTrophy, IoShield, IoTrendingUp, IoCheckmarkCircle,
  IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoYoutube, IoLogoTiktok,
  IoStar, IoPeople, IoFlash, IoChevronForward,
} from 'react-icons/io5';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Welcome = () => {
  const stats = [
    { value: '10K+', label: 'Active Users', icon: <IoPeople size={22} /> },
    { value: '₦82M+', label: 'Paid Out', icon: <IoWallet size={22} /> },
    { value: '500+', label: 'Tasks Available', icon: <IoCheckmarkCircle size={22} /> },
    { value: '4.8★', label: 'User Rating', icon: <IoStar size={22} /> },
  ];

  const features = [
    { icon: <IoRocket size={22} />, title: 'Easy Tasks', desc: 'Complete simple social media tasks and earn rewards instantly.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { icon: <IoWallet size={22} />, title: 'Quick Payouts', desc: 'Withdraw your earnings anytime with multiple payment options.', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { icon: <IoTrophy size={22} />, title: 'Earn More', desc: 'Complete more tasks and increase your earnings daily.', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { icon: <IoShield size={22} />, title: 'Secure Platform', desc: 'Your data and earnings are protected with top-tier security.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { icon: <IoTrendingUp size={22} />, title: 'Track Progress', desc: 'Monitor your earnings and task completion in real-time.', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    { icon: <IoFlash size={22} />, title: 'Instant Approval', desc: 'Tasks are reviewed and approved within minutes.', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ];

  const steps = [
    { num: '1', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card required.' },
    { num: '2', title: 'Complete Tasks', desc: 'Browse available tasks and complete them at your own pace.' },
    { num: '3', title: 'Get Paid', desc: 'Withdraw your earnings instantly to your bank account.' },
  ];

  const testimonials = [
    { name: 'Fatima Bello', role: 'Student, Lagos', quote: 'I made ₦45,000 in my first month just doing simple tasks. Taskora is genuinely life-changing!', rating: 5, initials: 'FB', color: 'bg-pink-500' },
    { name: 'Chukwuemeka Obi', role: 'Freelancer, Abuja', quote: 'The tasks are easy and payouts are fast. I withdraw every week without any issues.', rating: 5, initials: 'CO', color: 'bg-blue-500' },
    { name: 'Amina Yusuf', role: 'Teacher, Kano', quote: 'Perfect side income. I complete tasks during my lunch break and earn extra every day.', rating: 5, initials: 'AY', color: 'bg-green-500' },
  ];

  const socialPlatforms = [
    { icon: <IoLogoFacebook size={20} />, name: 'Facebook', color: 'text-blue-600 dark:text-blue-400' },
    { icon: <IoLogoInstagram size={20} />, name: 'Instagram', color: 'text-pink-500 dark:text-pink-400' },
    { icon: <IoLogoTwitter size={20} />, name: 'Twitter', color: 'text-sky-500 dark:text-sky-400' },
    { icon: <IoLogoYoutube size={20} />, name: 'YouTube', color: 'text-red-500 dark:text-red-400' },
    { icon: <IoLogoTiktok size={20} />, name: 'TikTok', color: 'text-gray-900 dark:text-white' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Taskora</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all hover:shadow-md hover:shadow-primary/25 active:scale-[.98]">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Start earning today — it's free</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Turn Your Time Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
                Real Money
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Complete simple social media tasks, earn rewards, and get paid instantly.
              Join thousands of Nigerians already making money with Taskora.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[.98]">
                <IoRocket size={18} /> Start Earning Now
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl transition-all active:scale-[.98]">
                Sign In <IoChevronForward size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl shadow-gray-200/60 dark:shadow-black/40 p-6 space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm opacity-80">Current Balance</p>
                    <IoWallet size={18} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold mb-4">₦12,450.00</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/20 rounded-xl py-2 text-center text-xs font-semibold">+ Deposit</div>
                    <div className="flex-1 bg-white rounded-xl py-2 text-center text-xs font-semibold text-blue-600">Withdraw</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Tasks Done', value: '45', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
                    { label: 'Earnings', value: '₦8.2K', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'Pending', value: '3', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                      <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide">Recent Tasks</p>
                  {[
                    { task: 'Follow @brand on Instagram', reward: '+₦250', status: 'Approved' },
                    { task: 'Like & Share Facebook post', reward: '+₦150', status: 'Pending' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                      <p className="text-xs text-gray-700 dark:text-zinc-300 truncate flex-1 mr-2">{t.task}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">{t.reward}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === 'Approved' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2"
              >
                <span className="text-lg">💸</span>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">+₦500 earned!</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Just now</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="border-y border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
            Tasks available on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {socialPlatforms.map(p => (
              <div key={p.name} className={`flex items-center gap-2 ${p.color}`}>
                {p.icon}
                <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Row */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                {s.icon}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-zinc-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <section className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">Start earning in three simple steps</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-extrabold mx-auto mb-5 shadow-lg shadow-primary/30">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Taskora?</h2>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">Everything you need to start earning money online with simple tasks</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">Real stories from real earners</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <IoStar key={j} size={14} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already making money with Taskora
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-gray-50 rounded-xl transition-all hover:shadow-lg active:scale-[.98]"
            >
              <IoRocket size={18} /> Create Free Account
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Taskora</span>
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
