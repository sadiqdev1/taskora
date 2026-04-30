import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { useToast } from '../../contexts/ToastContext';
import { mockTasks } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { IoTime, IoPeople, IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const task = mockTasks.find(t => t.id === id) || mockTasks[0];

  const handleSubmit = async () => {
    if (!proofUrl) {
      showToast('error', 'Please provide proof URL');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setShowSubmitModal(false);
      showToast('success', 'Task submitted successfully! Awaiting review.');
      navigate('/my-tasks');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon={<IoArrowBack />}
        onClick={() => navigate('/tasks')}
      >
        Back to Tasks
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-3">
              <Badge variant="info">{task.type.toUpperCase()}</Badge>
              <div className="text-right">
                <p className="text-base font-bold text-primary">
                  {formatCurrency(task.reward)}
                </p>
                <p className="text-xs text-gray-500">Reward</p>
              </div>
            </div>

            <h1 className="text-base font-bold text-gray-900 dark:text-white mb-3">
              {task.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {task.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <IoTime size={15} />
                <span>{task.estimatedTime} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IoPeople size={15} />
                <span>{task.remainingSlots} slots remaining</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Instructions
              </h2>
              <ol className="space-y-2">
                {task.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Requirements
              </h2>
              <ul className="space-y-2">
                {task.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <IoCheckmarkCircle className="text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Submit Task
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Complete the task following all instructions and submit your proof.
            </p>
            <Button
              className="w-full"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Proof
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Task Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Slots</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {task.totalSlots}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {task.remainingSlots}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(((task.totalSlots - task.remainingSlots) / task.totalSlots) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Task Proof"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Please provide proof that you completed the task (screenshot URL, link, etc.)
          </p>
          <Input
            label="Proof URL"
            placeholder="https://example.com/proof.jpg"
            value={proofUrl}
            onChange={setProofUrl}
            required
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSubmitModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetails;
