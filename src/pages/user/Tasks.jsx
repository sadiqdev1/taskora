import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Dropdown from '../../components/common/Dropdown';
import Pagination from '../../components/common/Pagination';
import { mockTasks } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { IoTime, IoPeople, IoTrophy } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Tasks = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Task Marketplace
        </h1>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <Dropdown
                label="Task Type"
                value={filter}
                onChange={setFilter}
                options={taskTypeOptions}
              />
            </div>
            <div className="flex-1">
              <Dropdown
                label="Sort By"
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
            </div>
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
              className="p-6 cursor-pointer h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant={getTaskTypeColor(task.type)} size="sm">
                  {task.type.toUpperCase()}
                </Badge>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(task.reward)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Reward</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {task.description}
              </p>

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
    </motion.div>
  );
};

export default Tasks;
