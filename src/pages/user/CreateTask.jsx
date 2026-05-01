import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../contexts/ToastContext';
import { IoClose, IoInformationCircle } from 'react-icons/io5';

const TASK_TYPES = [
  { id: 42, name: 'Comment on a Facebook Post', epc: 6, cost: 13, instructions: '- Go to the Facebook post \n- Comment on the post\n- Upload a screenshot', requiresVerification: false },
  { id: 20, name: 'Comment on a post', epc: 5, cost: 12, instructions: '- Go to the post\n- Comment on it ( Ensure your comment relates to the post and not a random comment )', requiresVerification: false },
  { id: 57, name: 'Comment on a song', epc: 6, cost: 18, instructions: '- Go to the song via the link attached\n- Comment on the song', requiresVerification: false },
  { id: 40, name: 'Comment on a YouTube Video', epc: 7, cost: 13, instructions: '- Go to the video \n- Comment on the YouTube video\n- Upload a screenshot', requiresVerification: false },
  { id: 48, name: 'Custom Task', epc: 15, cost: 50, instructions: 'Read the instructions below', requiresVerification: false },
  { id: 24, name: 'Download an app', epc: 20, cost: 45, instructions: '- Download the app from the link provided\n- Upload a screenshot', requiresVerification: false },
  { id: 25, name: 'Download and signup', epc: 30, cost: 70, instructions: '- Download the app\n- Sign up with your details\n- Upload a screenshot', requiresVerification: false },
  { id: 44, name: 'Favourite a TikTok video', epc: 5, cost: 15, instructions: '- Click on the bookmark/save icon\n- Take a screenshot \n-Upload screenshot', requiresVerification: false },
  { id: 31, name: 'Fill out a survey', epc: 40, cost: 150, instructions: '- Complete the survey form\n- Submit your responses\n- Upload a screenshot', requiresVerification: false },
  { id: 43, name: 'Follow a BoomPlay Profile', epc: 10, cost: 25, instructions: '- Go the boomplay profile\n- Ensure you have a boomplay account\n- Follow the profile \n-Upload a screenshot', requiresVerification: false },
  { id: 41, name: 'Follow a Facebook page', epc: 5, cost: 13, instructions: '- Go to the Facebook page \n- Follow the page \n- Upload a screenshot', requiresVerification: false },
  { id: 19, name: 'Follow a Page', epc: 5, cost: 12, instructions: '- Go to the profile\n- Follow the profile\n- Upload a screenshot', requiresVerification: false },
  { id: 27, name: 'Follow your artist profile', epc: 4, cost: 13, instructions: '- Go to the artist profile\n- Follow the profile\n- Upload a screenshot', requiresVerification: false },
  { id: 34, name: 'Join Group/Channel', epc: 7, cost: 15, instructions: '- Join the telegram channel \n- Enable notifications', requiresVerification: false },
  { id: 46, name: 'Like, comment and repost ( Instagram )', epc: 12, cost: 30, instructions: '- Like the post\n-Comment on the post\n-Repost the post', requiresVerification: false },
  { id: 52, name: 'Like, comment and retweet ( Twitter )', epc: 10, cost: 25, instructions: '- Like the tweet\n-Retweet the tweet\n-Comment on the tweet', requiresVerification: false },
  { id: 60, name: 'Like, comment and save/favourite ( TikTok )', epc: 10, cost: 25, instructions: '- Like the post\n- Comment on the post\n- Favourite the post', requiresVerification: false },
  { id: 18, name: 'Like a Post', epc: 4, cost: 12, instructions: '- Go to the post\n- Like the post\n- Upload a screenshot', requiresVerification: false },
  { id: 35, name: 'Like a song', epc: 7, cost: 21, instructions: '- Go to the song\n- Like the song\n- Upload a screenshot', requiresVerification: false },
  { id: 39, name: 'Like a YouTube Video', epc: 5, cost: 13, instructions: '- Go to the video \n- Like the YouTube video\n- Upload a screenshot', requiresVerification: false },
  { id: 49, name: 'Post a song on your Instagram story', epc: 1000, cost: 2500, instructions: '- Post a video on your Instagram story using the attached link\n\n- Submit the link to the story you posted in the username section', requiresVerification: true },
  { id: 50, name: 'Post a video on TikTok with a song', epc: 1200, cost: 3000, instructions: '- Post a video on TikTok using the sound provided\n\n- Do not delete the video after it\'s posted ( your account will be banned )', requiresVerification: true },
  { id: 58, name: 'Reply to a tweet using a specified hashtag', epc: 15, cost: 35, instructions: '- Reply to the tweet using the specified hashtag', requiresVerification: true },
  { id: 47, name: 'Retweet a post', epc: 4, cost: 12, instructions: '- Retweet the post\n- Upload a screenshot', requiresVerification: false },
  { id: 22, name: 'Share a post on your story', epc: 7, cost: 21, instructions: '- Share the post to your story\n- Upload a screenshot', requiresVerification: false },
  { id: 56, name: 'Share to story', epc: 6, cost: 24, instructions: '- Share the post to story\n- Upload a screenshot of the post you shared to your story \n- Input the link to the story you shared', requiresVerification: false },
  { id: 32, name: 'Signup on a website', epc: 10, cost: 33, instructions: '- Sign up on the website\n- Verify your account\n- Upload a screenshot', requiresVerification: false },
  { id: 28, name: 'Start a telegram bot', epc: 7, cost: 21, instructions: '- Start the telegram bot\n- Complete the initial setup\n- Upload a screenshot', requiresVerification: false },
  { id: 26, name: 'Stream your song', epc: 20, cost: 70, instructions: '- Stream the song for at least 30 seconds\n- Upload a screenshot', requiresVerification: false },
  { id: 38, name: 'Subscribe to a channel', epc: 6, cost: 13, instructions: '- Go to the channel \n- Subscribe to the channel\n- Upload a screenshot', requiresVerification: false },
  { id: 23, name: 'Tag a friend', epc: 8, cost: 24, instructions: '- Tag a friend in the post\n- Upload a screenshot', requiresVerification: false },
  { id: 55, name: 'Tag a person', epc: 8, cost: 24, instructions: '- Tag the person \n- Upload a screenshot', requiresVerification: false },
  { id: 59, name: 'TikTok Sound Use', epc: 100, cost: 250, instructions: '- Post a video on TikTok using the attached link\n- Upload a link to the video you posted into the username section\n- Failure to do task properly will lead to ban on your account', requiresVerification: false },
  { id: 21, name: 'Vote for someone on a post', epc: 6, cost: 20, instructions: '- Vote for the specified person\n- Upload a screenshot', requiresVerification: false },
  { id: 29, name: 'Vote for someone via a website', epc: 10, cost: 30, instructions: '- Go to the voting website\n- Vote for the specified person\n- Upload a screenshot', requiresVerification: false },
  { id: 30, name: 'Vote for someone via sms', epc: 25, cost: 75, instructions: '- Send the SMS vote\n- Upload a screenshot of the sent message', requiresVerification: false },
  { id: 33, name: 'Watch a video', epc: 10, cost: 33, instructions: '- Watch the video completely\n- Upload a screenshot', requiresVerification: false },
  { id: 53, name: 'WhatsApp Contact Save', epc: 7, cost: 20, instructions: '- Message the number\n- Save the number', requiresVerification: false },
  { id: 54, name: 'WhatsApp Group Join', epc: 7, cost: 18, instructions: '- Join the group/channel\n- Upload a screenshot', requiresVerification: false },
  { id: 36, name: 'Wish you happy birthday', epc: 4, cost: 10, instructions: '- Wish the person happy birthday\n- Upload a screenshot', requiresVerification: false },
];

const CreateTask = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    taskType: '',
    taskLink: '',
    instructions: '',
    workersNeeded: 50,
    costPerWorker: 0,
  });

  const [selectedTaskType, setSelectedTaskType] = useState(null);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'taskType') {
      const taskType = TASK_TYPES.find(t => t.id === parseInt(value));
      setSelectedTaskType(taskType);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        instructions: taskType?.instructions || '',
        costPerWorker: (taskType?.cost || 0) / 100, // Convert cents to dollars
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.taskType) {
      newErrors.taskType = 'Please select a task type';
    }

    if (!formData.taskLink.trim()) {
      newErrors.taskLink = 'Task link is required';
    } else if (!isValidUrl(formData.taskLink)) {
      newErrors.taskLink = 'Please enter a valid URL';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    } else if (formData.instructions.trim().length < 10) {
      newErrors.instructions = 'Instructions must be at least 10 characters';
    }

    if (formData.workersNeeded < 50) {
      newErrors.workersNeeded = 'Minimum quantity for a task is 50';
    }

    if (formData.costPerWorker <= 0) {
      newErrors.costPerWorker = 'Cost per worker must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const calculateTotalCost = () => {
    return (formData.workersNeeded * formData.costPerWorker).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast('Task created successfully!', 'success');
      navigate('/my-tasks');
    } catch (error) {
      showToast('Failed to create task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create a Task
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Create a new task for workers to complete
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Task Type <span className="text-red-500">*</span>
            </label>
            <Select
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              error={errors.taskType}
            >
              <option value="">Type of task</option>
              {TASK_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            {errors.taskType && (
              <p className="mt-1 text-sm text-red-500">{errors.taskType}</p>
            )}
            {selectedTaskType && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-zinc-300">
                    Suggested Cost per Worker:
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ${(selectedTaskType.cost / 100).toFixed(2)}
                  </span>
                </div>
                {selectedTaskType.requiresVerification && (
                  <p className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <IoInformationCircle className="w-4 h-4" />
                    This task requires verification
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Task Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Task Link <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              name="taskLink"
              value={formData.taskLink}
              onChange={handleChange}
              placeholder="https://example.com/post/12345"
              error={errors.taskLink}
            />
            {errors.taskLink && (
              <p className="mt-1 text-sm text-red-500">{errors.taskLink}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">
              Enter the full URL where the task should be completed
            </p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={6}
              placeholder="Provide clear instructions for workers on how to complete this task..."
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.instructions
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-zinc-700 focus:ring-blue-500'
              } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors resize-none`}
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">
              {formData.instructions.length} characters (minimum 10)
              {selectedTaskType && ' • Pre-filled with default instructions, you can customize them'}
            </p>
          </div>

          {/* Workers Needed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              How many workers do you need? <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="workersNeeded"
              value={formData.workersNeeded}
              onChange={handleChange}
              min="50"
              step="1"
              error={errors.workersNeeded}
            />
            {errors.workersNeeded && (
              <p className="mt-1 text-sm text-red-500">{errors.workersNeeded}</p>
            )}
            <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <IoInformationCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Minimum quantity for a task is 50 workers
              </p>
            </div>
          </div>

          {/* Cost Per Worker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Cost per Worker ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="costPerWorker"
              value={formData.costPerWorker}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              error={errors.costPerWorker}
            />
            {errors.costPerWorker && (
              <p className="mt-1 text-sm text-red-500">{errors.costPerWorker}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">
              Amount you will pay each worker for completing this task
            </p>
          </div>

          {/* Total Cost Summary */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Workers Needed:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formData.workersNeeded}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Cost per Worker:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${formData.costPerWorker}
              </span>
            </div>
            <div className="pt-2 border-t border-blue-200 dark:border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  Total Cost:
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${calculateTotalCost()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating Task...' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default CreateTask;
