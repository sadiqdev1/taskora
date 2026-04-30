import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { IoPerson, IoMail, IoCall, IoCalendar, IoCheckmarkCircle, IoWallet } from 'react-icons/io5';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            {!editing && (
              <Button onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              disabled={!editing}
              icon={<IoPerson />}
            />

            <Input
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              disabled={!editing}
              icon={<IoMail />}
            />

            <Input
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              disabled={!editing}
              icon={<IoCall />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!editing}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            {editing && (
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={saving}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Account Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IoCalendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
                  <IoCheckmarkCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.stats?.tasksCompleted}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 text-warning rounded-lg flex items-center justify-center">
                  <IoWallet size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(user?.stats?.totalEarned)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white">
            <h3 className="font-semibold mb-2">Account Status</h3>
            <p className="text-sm opacity-90 mb-4">
              Your account is in good standing
            </p>
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle size={20} />
              <span className="font-medium">Verified Account</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
