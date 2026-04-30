import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { mockSubmissions, mockTasks } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoCheckmarkCircle, IoTime, IoCloseCircle, IoList } from 'react-icons/io5';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tasks
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockSubmissions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
              <IoTime size={24} />
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
                className="p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task?.title}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task?.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Submitted: {formatDate(submission.submittedAt)}</span>
                      {submission.reviewedAt && (
                        <span>Reviewed: {formatDate(submission.reviewedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
