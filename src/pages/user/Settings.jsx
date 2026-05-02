import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { IoPersonCircle, IoLockClosed, IoTrash, IoSave, IoBell, IoShieldCheckmark } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'profile',   label: 'Profile',   icon: <IoPersonCircle size={18} /> },
  { id: 'security',  label: 'Security',  icon: <IoLockClosed size={18} /> },
  { id: 'notifications', label: 'Alerts', icon: <IoBell size={18} /> },
  { id: 'danger',    label: 'Danger',    icon: <IoTrash size={18} /> },
];

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State
  const [username, setUsername] = useState(user?.name || '');
  const [fullName, setFullName] = useState('Abubakar Ibrahim');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+234 123 456 7890');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    taskApproved: true,
    taskRejected: true,
    payment: true,
    newTasks: false,
    marketing: false,
  });

  const handleSaveProfile = () => {
    if (!username || !fullName || !email) {
      showToast('error', 'Please fill all required fields');
      return;
    }
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast('success', 'Profile updated successfully!');
    }, 1500);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('error', 'Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      showToast('error', 'Password must be at least 8 characters');
      return;
    }
    setChangingPassword(true);
    setTimeout(() => {
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'Password changed successfully!');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToast('error', 'Account deletion feature coming soon!');
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-700'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 pb-24 md:pb-6"
    >
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-600 dark:text-zinc-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="sm:w-48 flex-shrink-0"
        >
          <Card className="p-2">
            <nav className="flex sm:flex-col gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                    activeTab === tab.id
                      ? tab.id === 'danger'
                        ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className={activeTab === tab.id
                    ? tab.id === 'danger' ? 'text-red-500' : 'text-blue-500'
                    : 'text-gray-400 dark:text-zinc-600'
                  }>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                      <IoPersonCircle size={22} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Update your personal details</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input type="text" label="Username" placeholder="Enter username" value={username} onChange={setUsername} required />
                      <Input type="text" label="Full Name" placeholder="Enter full name" value={fullName} onChange={setFullName} required />
                    </div>
                    <Input type="email" label="Email Address" placeholder="Enter email address" value={email} onChange={setEmail} required />
                    <Input type="tel" label="Phone Number" placeholder="Enter phone number" value={phone} onChange={setPhone} />
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSaveProfile} loading={savingProfile} className="flex items-center gap-2">
                        <IoSave size={16} /> Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Card className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                      <IoLockClosed size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Keep your account secure</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input type="password" label="Current Password" placeholder="Enter current password" value={currentPassword} onChange={setCurrentPassword} required />
                    <Input type="password" label="New Password" placeholder="Enter new password" value={newPassword} onChange={setNewPassword} required />
                    <Input type="password" label="Confirm New Password" placeholder="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} required />
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleChangePassword} loading={changingPassword} className="flex items-center gap-2">
                        <IoLockClosed size={16} /> Change Password
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* 2FA hint card */}
                <Card className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IoShieldCheckmark size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button size="sm" variant="outline">Enable</Button>
                </Card>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                      <IoBell size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Choose what you want to be notified about</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { key: 'taskApproved', label: 'Task Approved', desc: 'When your submission gets approved' },
                      { key: 'taskRejected', label: 'Task Rejected', desc: 'When your submission is rejected' },
                      { key: 'payment', label: 'Payments', desc: 'When you receive a payment or withdrawal' },
                      { key: 'newTasks', label: 'New Tasks', desc: 'When new tasks matching your profile are added' },
                      { key: 'marketing', label: 'Promotions', desc: 'Platform updates and promotional offers' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-500">{item.desc}</p>
                        </div>
                        <Toggle
                          checked={notifPrefs[item.key]}
                          onChange={(v) => setNotifPrefs(p => ({ ...p, [item.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => showToast('success', 'Notification preferences saved!')} className="flex items-center gap-2">
                      <IoSave size={16} /> Save Preferences
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Danger Tab */}
            {activeTab === 'danger' && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-5 sm:p-6 border-red-200 dark:border-red-500/20">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                      <IoTrash size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Irreversible and destructive actions</p>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 mb-5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Delete Account</p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">
                      Once you delete your account, there is no going back. All your data, earnings, and tasks will be permanently deleted.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <IoTrash size={16} /> Delete Account
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
