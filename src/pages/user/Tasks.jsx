import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Dropdown from '../../components/common/Dropdown';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { mockTasks, mockSubmissions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoTime, IoPeople, IoStorefront, IoCheckmarkDone, IoCheckmarkCircle, IoCloseCircle, IoList } from 'react-icons/io5';
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
    { id: 'my-tasks', label: 'My Tasks', icon: <IoCheckmarkDone /> },
  ];

  const myTasksTabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
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
      post: 'info',
      follow: 'success',
      comment: 'warning',
      share: 'info',
      download: 'success',
      visit: 'default',
    };
    return colors[type] || 'default';
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
      className="space-y-6"
    >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card
                  hover
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="p-4 cursor-pointer h-full"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getTaskTypeColor(task.type)} size="sm">
                      {task.type.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(task.reward)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Reward</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <IoTime size={13} />
                      <span>{task.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoPeople size={13} />
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">Total Earnings</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {formatCurrency(1250.50)}
                  </p>
                </div>
                <div className="w-9 h-9 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                  <IoCheckmarkCircle size={18} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">Completed Tasks</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">45</p>
                </div>
                <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  <IoList size={18} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">Pending Review</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {mockSubmissions.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                  <IoTime size={18} />
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
                {myTasksTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMyTasksFilter(tab.id)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      myTasksFilter === tab.id
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
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
                icon={<IoList size={32} />}
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
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {task?.title}
                            </h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {task?.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Submitted: {formatDate(submission.submittedAt)}</span>
                            {submission.reviewedAt && (
                              <span>Reviewed: {formatDate(submission.reviewedAt)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(task?.reward || 0)}
                          </p>
                          {submission.status === 'approved' && (
                            <p className="text-xs text-green-600 dark:text-green-400">Earned</p>
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
