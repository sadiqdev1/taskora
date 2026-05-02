import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Dropdown from '../../components/common/Dropdown';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { mockTasks, mockSubmissions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  IoTime, 
  IoPeople, 
  IoStorefront, 
  IoCheckmarkDone, 
  IoCheckmarkCircle, 
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
  IoCreate,
  IoDocumentText
} from 'react-icons/io5';
import { motion } from 'framer-motion';

const Tasks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [myTasksFilter, setMyTasksFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const mainTabs = [
    { id: 'marketplace', label: 'Marketplace', icon: <IoStorefront /> },
    { id: 'my-tasks', label: 'My Submissions', icon: <IoDocumentText /> },
  ];

  const myTasksTabs = [
    { id: 'pending', label: 'Pending', color: 'orange', count: mockSubmissions.filter(s => s.status === 'pending').length },
    { id: 'approved', label: 'Completed', color: 'green', count: mockSubmissions.filter(s => s.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', color: 'red', count: mockSubmissions.filter(s => s.status === 'rejected').length },
  ];

  const taskTypeOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'post', label: 'Post' },
    { value: 'follow', label: 'Follow' },
    { value: 'comment', label: 'Comment' },
    { value: 'share', label: 'Share' },
    { value: 'download', label: 'Download' },
    { value: 'visit', label: 'Visit' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest', label: 'Highest Reward' },
    { value: 'lowest', label: 'Lowest Reward' },
  ];

  // Filter and sort tasks
  let filteredTasks = filter === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.type === filter);

  if (sortBy === 'highest') {
    filteredTasks = [...filteredTasks].sort((a, b) => b.reward - a.reward);
  } else if (sortBy === 'lowest') {
    filteredTasks = [...filteredTasks].sort((a, b) => a.reward - b.reward);
  }

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

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

  const getTaskById = (taskId) => mockTasks.find(t => t.id === taskId);

  const filteredSubmissions = mockSubmissions.filter(sub => {
    if (myTasksFilter === 'pending') return sub.status === 'pending';
    if (myTasksFilter === 'approved') return sub.status === 'approved';
    if (myTasksFilter === 'rejected') return sub.status === 'rejected';
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tasks
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Browse available tasks or check your submissions
        </p>
      </motion.div>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-2">
          <div className="flex gap-2">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
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
      </motion.div>

      {/* Marketplace Tab Content */}
      {activeTab === 'marketplace' && (
        <>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Dropdown
                  label="Task Type"
                  value={filter}
                  onChange={setFilter}
                  options={taskTypeOptions}
                />
                <Dropdown
                  label="Sort By"
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                />
              </div>
            </Card>
          </motion.div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  hover
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className={`p-6 cursor-pointer h-full border-l-4 ${getTaskTypeColor(task.type).border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                        {getTaskIcon(task.type, task.platform)}
                      </div>
                      <Badge variant={getTaskTypeColor(task.type).badge} size="sm">
                        {task.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1.5 bg-blue-500 text-white rounded-full">
                        <p className="text-lg font-bold">
                          {formatCurrency(task.reward)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Reward</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Slots Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500 mb-1.5">
                      <span>{task.remainingSlots} slots left</span>
                      <span>{task.totalSlots - task.remainingSlots}/{task.totalSlots} taken</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          task.remainingSlots / task.totalSlots < 0.2
                            ? 'bg-red-500'
                            : task.remainingSlots / task.totalSlots < 0.5
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${((task.totalSlots - task.remainingSlots) / task.totalSlots) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <IoTime />
                      <span>{task.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoPeople />
                      <span>{task.remainingSlots} left</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}
        </>
      )}

      {/* My Tasks Tab Content */}
      {activeTab === 'my-tasks' && (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(1250.50)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                  <IoCheckmarkCircle size={24} />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Completed Tasks</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">45</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <IoList size={24} />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Pending Review</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockSubmissions.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                  <IoTime size={24} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* My Tasks Sub-Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-2">
              <div className="flex gap-2">
                {myTasksTabs.map((tab) => {
                  const colorClasses = {
                    orange: myTasksFilter === tab.id ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-500/10',
                    green: myTasksFilter === tab.id ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-green-500/10',
                    red: myTasksFilter === tab.id ? 'bg-red-500 text-white' : 'text-gray-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10',
                  };
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMyTasksFilter(tab.id)}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${colorClasses[tab.color]}`}
                    >
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                          myTasksFilter === tab.id 
                            ? 'bg-white/20' 
                            : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Task List */}
          {filteredSubmissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <EmptyState
                icon={<IoList size={48} />}
                title={`No ${myTasksFilter} tasks`}
                description="Start completing tasks to see them here"
                action={{
                  label: 'Browse Tasks',
                  onClick: () => setActiveTab('marketplace'),
                }}
              />
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => {
                const task = getTaskById(submission.taskId);
                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Card
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Tasks;
