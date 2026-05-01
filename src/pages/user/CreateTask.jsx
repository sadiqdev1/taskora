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
  { value: 'facebook_comment', label: 'Comment on a Facebook Post' },
  { value: 'general_comment_post', label: 'Comment on a post' },
  { value: 'comment_song', label: 'Comment on a song' },
  { value: 'youtube_comment', label: 'Comment on a YouTube Video' },
  { value: 'custom_task', label: 'Custom Task' },
  { value: 'download_app', label: 'Download an app' },
  { value: 'download_signup', label: 'Download and signup' },
  { value: 'tiktok_favourite', label: 'Favourite a TikTok video' },
  { value: 'fill_survey', label: 'Fill out a survey' },
  { value: 'follow_boomplay', label: 'Follow a BoomPlay Profile' },
  { value: 'follow_facebook_page', label: 'Follow a Facebook page' },
  { value: 'follow_page', label: 'Follow a Page' },
  { value: 'follow_artist', label: 'Follow your artist profile' },
  { value: 'join_group_channel', label: 'Join Group/Channel' },
  { value: 'instagram_engage', label: 'Like, comment and repost ( Instagram )' },
  { value: 'twitter_engage', label: 'Like, comment and retweet ( Twitter )' },
  { value: 'tiktok_engage', label: 'Like, comment and save/favourite ( TikTok )' },
  { value: 'like_post', label: 'Like a Post' },
  { value: 'like_song', label: 'Like a song' },
  { value: 'youtube_like', label: 'Like a YouTube Video' },
  { value: 'instagram_story_song', label: 'Post a song on your Instagram story' },
  { value: 'tiktok_video_song', label: 'Post a video on TikTok with a song' },
  { value: 'tweet_reply_hashtag', label: 'Reply to a tweet using a specified hashtag' },
  { value: 'retweet', label: 'Retweet a post' },
  { value: 'share_story', label: 'Share a post on your story' },
  { value: 'share_to_story', label: 'Share to story' },
  { value: 'website_signup', label: 'Signup on a website' },
  { value: 'telegram_bot', label: 'Start a telegram bot' },
  { value: 'stream_song', label: 'Stream your song' },
  { value: 'youtube_subscribe', label: 'Subscribe to a channel' },
  { value: 'tag_friend', label: 'Tag a friend' },
  { value: 'tag_person', label: 'Tag a person' },
  { value: 'tiktok_sound_use', label: 'TikTok Sound Use' },
  { value: 'vote_post', label: 'Vote for someone on a post' },
  { value: 'vote_website', label: 'Vote for someone via a website' },
  { value: 'vote_sms', label: 'Vote for someone via sms' },
  { value: 'watch_video', label: 'Watch a video' },
  { value: 'whatsapp_contact_save', label: 'WhatsApp Contact Save' },
  { value: 'whatsapp_group_join', label: 'WhatsApp Group Join' },
  { value: 'birthday_wish', label: 'Wish you happy birthday' },
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
    costPerWorker: 0.5,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              <option value="">Select task type</option>
              {TASK_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.taskType && (
              <p className="mt-1 text-sm text-red-500">{errors.taskType}</p>
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
              rows={5}
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
