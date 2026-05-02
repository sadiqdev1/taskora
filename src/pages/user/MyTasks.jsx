import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { mockSubmissions, mockTasks } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  IoCheckmarkCircle, 
  IoTime, 
  IoCloseCircle, 
  IoList,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
  IoLogoTiktok,
  IoShareSocial,
  IoChatbubble,
  IoPersonAdd,
  IoDownload,
  IoGlobe,
  IoCreate
} from 'react-icons/io5';

const MyTasks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', label: 'Pending', icon: <IoTime /> },
    { id: 'approved', label: 'Completed', icon: <IoCheckmarkCircle /> },
    { id: 'rejected', label: 'Rejected', icon: <IoCloseCircle /> },
  ];

  const getTaskById = (taskId) => mockTasks.find(t => t.id === taskId);

  const filteredSubmissions = mockSubmissions.filter(sub => {
    if (activeTab === 'pending') return sub.status === 'pending';
    if (activeTab === 'approved') return sub.status === 'approved';
    if (activeTab === 'rejected') return sub.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    };
    const labels = {
      pending: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTaskIcon = (type, platform = 'general') => {
    // Return proper icon components based on task type and platform
    const iconMap = {
      post: {
        facebook: <IoLogoFacebook className="text-blue-600" />,
        instagram: <IoLogoInstagram className="text-pink-600" />,
        twitter: <IoLogoTwitter className="text-sky-500" />,
        youtube: <IoLogoYoutube className="text-red-600" />,
        tiktok: <IoLogoTiktok className="text-gray-900 dark:text-white" />,
        general: <IoCreate className="text-blue-500" />
      },
      follow: {
        facebook: <IoLogoFacebook className="text-blue-600" />,
        instagram: <IoLogoInstagram className="text-pink-600" />,
        twitter: <IoLogoTwitter className="text-sky-500" />,
        youtube: <IoLogoYoutube className="text-red-600" />,
        tiktok: <IoLogoTiktok className="text-gray-900 dark:text-white" />,
        general: <IoPersonAdd className="text-green-500" />
      },
      comment: {
        facebook: <IoLogoFacebook className="text-blue-600" />,
        instagram: <IoLogoInstagram className="text-pink-600" />,
        twitter: <IoLogoTwitter className="text-sky-500" />,
        youtube: <IoLogoYoutube className="text-red-600" />,
        general: <IoChatbubble className="text-amber-500" />
      },
      share: {
        facebook: <IoLogoFacebook className="text-blue-600" />,
        instagram: <IoLogoInstagram className="text-pink-600" />,
        twitter: <IoLogoTwitter className="text-sky-500" />,
        general: <IoShareSocial className="text-cyan-500" />
      },
      download: <IoDownload className="text-emerald-500" />,
      visit: <IoGlobe className="text-gray-600 dark:text-zinc-400" />,
    };

    // If type has platform-specific icons, return based on platform
    if (typeof iconMap[type] === 'object' && !iconMap[type].props) {
      return iconMap[type][platform] || iconMap[type].general;
    }
    
    return iconMap[type] || <IoList className="text-gray-500" />;
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      post: { badge: 'info', border: 'border-blue-500' },
      follow: { badge: 'success', border: 'border-green-500' },
      comment: { badge: 'warning', border: 'border-amber-500' },
      share: { badge: 'info', border: 'border-cyan-500' },
      download: { badge: 'success', border: 'border-emerald-500' },
      visit: { badge: 'default', border: 'border-gray-500' },
    };
    return colors[type] || { badge: 'default', border: 'border-gray-500' };
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Tasks
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Track your submitted tasks and earnings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Total Earnings</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(1250.50)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <IoCheckmarkCircle size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Completed Tasks</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <IoList size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">Pending Review</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {mockSubmissions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <IoTime size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Task List */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState
          icon={<IoList size={48} />}
          title={`No ${activeTab} tasks`}
          description="Start completing tasks to see them here"
          action={{
            label: 'Browse Tasks',
            onClick: () => navigate('/tasks'),
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => {
            const task = getTaskById(submission.taskId);
            return (
              <Card
                key={submission.id}
                hover
                onClick={() => navigate(`/tasks/${submission.taskId}`)}
                className={`p-4 sm:p-6 cursor-pointer border-l-4 ${getTaskTypeColor(task?.type).border}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Task Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {getTaskIcon(task?.type, task?.platform)}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {task?.title}
                      </h3>
                      {getStatusBadge(submission.status)}
                      <Badge variant={getTaskTypeColor(task?.type).badge} size="sm">
                        {task?.type?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task?.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
                      <span>Submitted: {formatDate(submission.submittedAt)}</span>
                      {submission.reviewedAt && (
                        <span>Reviewed: {formatDate(submission.reviewedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="text-right flex-shrink-0">
                    <div className="px-3 py-1.5 bg-blue-500 text-white rounded-full">
                      <p className="text-base sm:text-lg font-bold whitespace-nowrap">
                        {formatCurrency(task?.reward || 0)}
                      </p>
                    </div>
                    {submission.status === 'approved' && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Earned</p>
                    )}
                  </div>
                </div>

                {submission.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Rejection Reason:</strong> {submission.rejectionReason}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
