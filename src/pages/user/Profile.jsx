import { useState, useRef } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  IoPerson, IoMail, IoCall, IoCalendar,
  IoCheckmarkCircle, IoWallet, IoCamera,
  IoShieldCheckmark, IoStar, IoTrendingUp
} from 'react-icons/io5';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+234 123 456 7890',
    bio: user?.bio || 'Task enthusiast and reward hunter',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      showToast('success', 'Profile updated successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+234 123 456 7890',
      bio: user?.bio || 'Task enthusiast and reward hunter',
    });
    setAvatarPreview(null);
    setEditing(false);
  };

  const stats = [
    {
      label: 'Tasks Done',
      value: user?.stats?.tasksCompleted || 45,
      icon: <IoCheckmarkCircle size={18} />,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      label: 'Total Earned',
      value: formatCurrency(user?.stats?.totalEarned || 1250.50),
      icon: <IoWallet size={18} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Success Rate',
      value: '94%',
      icon: <IoStar size={18} />,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'Rank',
      value: 'Top 10%',
      icon: <IoTrendingUp size={18} />,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Profile</h1>
        <p className="text-gray-600 dark:text-zinc-400">Manage your public profile and account info</p>
      </motion.div>

      {/* Cover + Avatar Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          {/* Cover */}
          <div className="h-32 sm:h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
          </div>

          {/* Avatar + Info */}
          <div className="px-5 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-12">
              {/* Avatar */}
              <div className="relative w-fit">
                <img
                  src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                  alt={user?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white dark:ring-zinc-900 object-cover shadow-lg"
                />
                {editing && (
                  <>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition"
                    >
                      <IoCamera size={14} />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </>
                )}
              </div>

              {/* Name + badge */}
              <div className="flex-1 sm:mb-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                    <IoShieldCheckmark size={12} /> Verified
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-zinc-500">{user?.email}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5">
                  Member since {formatDate(user?.createdAt)}
                </p>
              </div>

              {/* Edit button */}
              {!editing ? (
                <Button size="sm" onClick={() => setEditing(true)} className="self-start sm:self-auto">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 self-start sm:self-auto">
                  <Button size="sm" variant="secondary" onClick={handleCancel}>Cancel</Button>
                  <Button size="sm" onClick={handleSave} loading={saving}>Save</Button>
                </div>
              )}
            </div>

            {/* Bio */}
            {!editing && (
              <p className="mt-4 text-sm text-gray-600 dark:text-zinc-400 max-w-lg">
                {formData.bio || 'No bio added yet.'}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Stats chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {stats.map((s, i) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Card className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-zinc-500 truncate">{s.label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{s.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <IoPerson className="text-blue-500" size={18} />
              Edit Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(v) => handleChange('name', v)}
                  icon={<IoPerson />}
                />
                <Input
                  type="tel"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(v) => handleChange('phone', v)}
                  icon={<IoCall />}
                />
              </div>
              <Input
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                icon={<IoMail />}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={3}
                  placeholder="Tell others about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
