import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { IoPersonCircle, IoLockClosed, IoTrash, IoSave } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <IoPersonCircle size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Update your personal details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={setUsername}
                required
              />

              <Input
                type="text"
                label="Full Name"
                placeholder="Enter full name"
                value={fullName}
                onChange={setFullName}
                required
              />
            </div>

            <Input
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              value={email}
              onChange={setEmail}
              required
            />

            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter phone number"
              value={phone}
              onChange={setPhone}
            />

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveProfile}
                loading={savingProfile}
                className="flex items-center gap-2"
              >
                <IoSave size={18} />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Password Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
              <IoLockClosed size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
            />

            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={setNewPassword}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleChangePassword}
                loading={changingPassword}
                className="flex items-center gap-2"
              >
                <IoLockClosed size={18} />
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-4 sm:p-6 border-red-200 dark:border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
              <IoTrash size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Danger Zone
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Irreversible and destructive actions
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 mb-4">
            <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
              <strong>Delete Account</strong>
            </p>
            <p className="text-xs text-gray-600 dark:text-zinc-400">
              Once you delete your account, there is no going back. All your data, earnings, and tasks will be permanently deleted.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/10 flex items-center gap-2"
          >
            <IoTrash size={18} />
            Delete Account
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
