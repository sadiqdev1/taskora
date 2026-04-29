import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { mockTasks } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { IoTime, IoPeople, IoTrophy } from 'react-icons/io5';

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Task Marketplace
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse and complete tasks to earn rewards
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Task Type"
            value={filter}
            onChange={setFilter}
            options={taskTypeOptions}
          />
          <Select
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </Card>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTasks.map((task) => (
          <Card
            key={task.id}
            hover
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="p-6 cursor-pointer"
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
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;
