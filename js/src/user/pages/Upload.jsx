import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { useToast } from '../../admin/Contexts/ToastContexts';
import LoadingSpinner from '../components/LoadingSpinner';
import Cropper from 'react-easy-crop';
import {
  CloudUpload,
  Crop,
  X,
  Loader2,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Calendar,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CAPTION = 200;
const MAX_DESCRIPTION = 500;
const MAX_TAGS = 5;

// Extract hashtags from a string
const extractHashtags = (text) => {
  const matches = text.match(/#(\w+)/g);
  if (!matches) return [];
  return matches.map(tag => tag.slice(1));
};

const Upload = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [imageLoadProgress, setImageLoadProgress] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    description: '',
    tags: [],
    ignoredTags: [],
    image: null,
    imagePreview: null,
    mature: false,
    allowComments: true,
    scheduleDate: '',
    postType: 'image', // 'image' or 'text'
    textContent: '',
    textStyle: {
      fontFamily: 'Arial',
      fontSize: 32,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      backgroundColor: '#3b82f6',
    },
  });
  const [dragActive, setDragActive] = useState(false);
  const [captionError, setCaptionError] = useState('');
  const [captionCount, setCaptionCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const previewTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
useEffect(() => {
  const handlePaste = (e) => {
    const file = e.clipboardData.files?.[0];

    if (file) {
      processImage(file);
    } else {
      const url = e.clipboardData.getData("text");
      if (url) setOriginalImage(url);
    }
  };

  window.addEventListener("paste", handlePaste);
  return () => window.removeEventListener("paste", handlePaste);
}, []);

  
  // Update tags from caption
  useEffect(() => {
    const rawTags = extractHashtags(formData.caption);
    const ignoredSet = new Set(formData.ignoredTags || []);
    const newTags = [...new Set(rawTags)]
      .filter(tag => !ignoredSet.has(tag))
      .slice(0, MAX_TAGS);
    setFormData(prev => ({ ...prev, tags: newTags }));
  }, [formData.caption, formData.ignoredTags]);

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('uploadDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          image: null,
          imagePreview: null,
          ignoredTags: parsed.ignoredTags || [],
        }));
        setCaptionCount(parsed.caption?.length || 0);
        setDescriptionCount(parsed.description?.length || 0);
      } catch (e) {}
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (!formData.image && !uploading) {
      const { image, imagePreview, ...draft } = formData;
      localStorage.setItem('uploadDraft', JSON.stringify(draft));
      setHasUnsaved(true);
    }
  }, [formData, uploading]);

  useEffect(() => {
    if (uploading) setHasUnsaved(false);
  }, [uploading]);

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Unsaved changes warning
  useBeforeUnload(
    useCallback((e) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    }, [hasUnsaved])
  );

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCropModal) {
        setShowCropModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCropModal]);

  // Focus trap inside modal
  useEffect(() => {
    if (showCropModal && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        firstFocusableRef.current = focusable[0];
        firstFocusableRef.current.focus();
      }
    }
  }, [showCropModal]);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.addToast('Please upload an image file', 'error');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.addToast(`File too large. Max size ${MAX_FILE_SIZE / 1024 / 1024}MB`, 'error');
      return false;
    }
    return true;
  };

  const processImage = (file) => {
    if (!validateFile(file)) return;
    setIsReadingImage(true);
    setImageLoadProgress(0);
  const reader = new FileReader();

reader.onloadend = () => {
  clearInterval(progressIntervalRef.current);
  setImageLoadProgress(100);

  previewTimeoutRef.current = setTimeout(() => {
    setOriginalImage(reader.result);
    setShowCropModal(true);
    setIsReadingImage(false);
  }, 500);
};

reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    setIsApplyingCrop(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels);
      setFormData(prev => ({
        ...prev,
        image: croppedImage.file,
        imagePreview: croppedImage.url,
      }));
      setShowCropModal(false);
      setOriginalImage(null);
    } catch (e) {
      toast.addToast('Failed to crop image', 'error');
    } finally {
      setIsApplyingCrop(false);
    }
  };

  const useOriginalImage = () => {
    fetch(originalImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'original.jpg', { type: 'image/jpeg' });
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: originalImage,
        }));
        setShowCropModal(false);
        setOriginalImage(null);
      });
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image();
image.crossOrigin = "anonymous";
image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob((blob) => {
          const file = new File([blob], `meme-${Date.now()}.jpg`, { type: 'image/jpeg' });
          resolve({ url: canvas.toDataURL('image/jpeg'), file });
        }, 'image/jpeg');
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processImage(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
    else toast.addToast('Please drop an image file', 'error');
  };

  const handleCaptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CAPTION) {
      setFormData(prev => ({ ...prev, caption: value }));
      setCaptionCount(value.length);
      if (value.length > 0) setCaptionError('');
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION) {
      setFormData(prev => ({ ...prev, description: value }));
      setDescriptionCount(value.length);
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      ignoredTags: [...(prev.ignoredTags || []), tagToRemove],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate caption
    if (!formData.caption || formData.caption.trim().length === 0) {
      setCaptionError('Caption is required');
      return;
    }

    // Check for repeated characters (more than 3 consecutive)
    if (/(.)\1{3,}/.test(formData.caption)) {
      setCaptionError('Caption contains too many repeated characters. Please enter meaningful text.');
      return;
    }

    // Check for minimum word count (at least 2 words)
    const words = formData.caption.trim().split(/\s+/);
    if (words.length < 2) {
      setCaptionError('Caption must contain at least 2 words.');
      return;
    }

    // Validate based on post type
    if (formData.postType === 'image' && !formData.image) {
      toast.addToast('Please select an image', 'error');
      return;
    }

    if (formData.postType === 'text' && !formData.textContent.trim()) {
      toast.addToast('Please enter text content for your text post', 'error');
      return;
    }

    setCaptionError('');
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (prev < 50 ? 8 : 5);
      });
    }, 200);

    // Prepare form data for submission
    const submitData = new FormData();
    submitData.append('title', formData.caption);
    if (formData.description) submitData.append('description', formData.description);
    if (formData.tags.length > 0) {
      formData.tags.forEach((tag, index) => {
        submitData.append(`tags[${index}]`, tag);
      });
    }
    submitData.append('is_mature', formData.mature ? '1' : '0');
    submitData.append('allow_comments', formData.allowComments ? '1' : '0');
    submitData.append('post_type', formData.postType);

    if (formData.postType === 'image' && formData.image) {
      submitData.append('image', formData.image);
    }

    if (formData.postType === 'text') {
      submitData.append('text_content', formData.textContent);
      submitData.append('text_style[font_family]', formData.textStyle.fontFamily);
      submitData.append('text_style[font_size]', formData.textStyle.fontSize);
      submitData.append('text_style[font_weight]', formData.textStyle.fontWeight);
      submitData.append('text_style[font_style]', formData.textStyle.fontStyle);
      submitData.append('text_style[text_align]', formData.textStyle.textAlign);
      submitData.append('text_style[background_color]', formData.textStyle.backgroundColor);
    }

    // Submit to backend
    fetch('/memes', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: submitData,
    })
      .then(response => {
        clearInterval(interval);
        setUploadProgress(100);
        if (response.ok) {
          return response.json();
        }
        throw new Error('Upload failed');
      })
      .then(() => {
        setTimeout(() => {
          setUploading(false);
          localStorage.removeItem('uploadDraft');
          toast.addToast('Meme uploaded successfully!', 'success');
          navigate('/profile');
        }, 500);
      })
      .catch(error => {
        clearInterval(interval);
        setUploading(false);
        toast.addToast('Upload failed. Please try again.', 'error');
        console.error('Upload error:', error);
      });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CloudUpload className="text-orange-500" size={32} />
          Upload New Meme
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mt-2"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        {/* Post Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, postType: 'image' }))}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                formData.postType === 'image'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="mx-auto mb-1" size={20} />
              <span className="text-sm font-medium">Image Post</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, postType: 'text' }))}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                formData.postType === 'text'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <svg className="mx-auto mb-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
              </svg>
              <span className="text-sm font-medium">Text Post</span>
            </button>
          </div>
        </div>

        {/* Image upload area - only show for image posts */}
        {formData.postType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (max 10MB)</label>
            {formData.imagePreview ? (
            <div className="relative w-48 h-48 group">
              <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md" />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
                  setOriginalImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow-md"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOriginalImage(formData.imagePreview);
                  setShowCropModal(true);
                }}
                className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 transition shadow-md"
                aria-label="Crop image"
              >
                <Crop size={14} />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload image"
              />
              {isReadingImage ? (
                <div className="w-full px-6">
                  <div className="text-center mb-2 text-sm text-gray-600">Loading image... {Math.round(imageLoadProgress)}%</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-150"
                      style={{ width: `${imageLoadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <CloudUpload
                    size={40}
                    className={`mx-auto mb-2 transition-colors ${
                      dragActive ? 'text-orange-500' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-sm text-gray-500">
                    {dragActive ? 'Drop your image here' : 'Click or drag to upload (max 10MB)'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* Text content area - only show for text posts */}
        {formData.postType === 'text' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">
                Text Content (max 1000 characters)
              </label>
              <textarea
                id="textContent"
                rows="6"
                value={formData.textContent}
                onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
                placeholder="What's on your mind?"
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">{formData.textContent.length}/1000 characters</p>
            </div>

            {/* Text Styling Options */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Text Styling</h4>
              
              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
                <select
                  value={formData.textStyle.fontFamily}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    textStyle: { ...prev.textStyle, fontFamily: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier">Courier</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size: {formData.textStyle.fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={formData.textStyle.fontSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    textStyle: { ...prev.textStyle, fontSize: parseInt(e.target.value) }
                  }))}
                  className="w-full"
                />
              </div>

              {/* Font Weight & Style */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      fontWeight: prev.textStyle.fontWeight === 'bold' ? 'normal' : 'bold'
                    }
                  }))}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                    formData.textStyle.fontWeight === 'bold'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      fontStyle: prev.textStyle.fontStyle === 'italic' ? 'normal' : 'italic'
                    }
                  }))}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm italic transition-all ${
                    formData.textStyle.fontStyle === 'italic'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  I
                </button>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        textStyle: { ...prev.textStyle, textAlign: align }
                      }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                        formData.textStyle.textAlign === align
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Background Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#000000'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        textStyle: { ...prev.textStyle, backgroundColor: color }
                      }))}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.textStyle.backgroundColor === color
                          ? 'border-orange-500 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.textStyle.backgroundColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      textStyle: { ...prev.textStyle, backgroundColor: e.target.value }
                    }))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview */}
              {formData.textContent && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Preview</label>
                  <div
                    className="w-full aspect-[4/3] rounded-xl flex items-center justify-center p-6 overflow-hidden"
                    style={{
                      backgroundColor: formData.textStyle.backgroundColor,
                      fontFamily: formData.textStyle.fontFamily,
                      fontSize: `${formData.textStyle.fontSize * 0.5}px`,
                      fontWeight: formData.textStyle.fontWeight,
                      fontStyle: formData.textStyle.fontStyle,
                      textAlign: formData.textStyle.textAlign,
                      color: (() => {
                        const hex = formData.textStyle.backgroundColor.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                        return brightness > 128 ? '#000000' : '#ffffff';
                      })(),
                    }}
                  >
                    <p className="break-words max-w-full">{formData.textContent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Caption with counter and hashtag helper */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
            <span className={`text-xs ${captionCount > MAX_CAPTION ? 'text-red-500' : 'text-gray-400'}`}>
              {captionCount}/{MAX_CAPTION}
            </span>
          </div>
          <input
            type="text"
            id="caption"
            value={formData.caption}
            onChange={handleCaptionChange}
            className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition ${
              captionError ? 'border-red-500' : captionCount >= MAX_CAPTION ? 'border-yellow-400' : 'border-gray-200'
            }`}
            placeholder="Write a funny caption... use #tags"
            required
            aria-describedby={captionError ? 'caption-error' : 'caption-helper'}
          />
          {captionError ? (
            <p id="caption-error" className="text-xs text-red-500 mt-1">{captionError}</p>
          ) : (
            <p id="caption-helper" className="text-xs text-gray-400 mt-1">
              Use #hashtags to make your meme discoverable (max {MAX_TAGS})
            </p>
          )}

          {/* Display detected hashtags */}
          {formData.tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Hashtags detected:</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-orange-500 hover:text-orange-700"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description with counter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <span className={`text-xs ${descriptionCount > MAX_DESCRIPTION ? 'text-red-500' : 'text-gray-400'}`}>
              {descriptionCount}/{MAX_DESCRIPTION}
            </span>
          </div>
          <textarea
            id="description"
            rows="2"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            placeholder="Add more context..."
          />
        </div>

        {/* Advanced settings toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition"
          >
            {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span>Advanced settings</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {/* Mature Content toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Mature Content</p>
                  <p className="text-xs text-gray-500">Mark for audiences 18+</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mature: !prev.mature }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                    formData.mature ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle mature content"
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      formData.mature ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Enable comments toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Enable comments</p>
                  <p className="text-xs text-gray-500">Let others comment on your meme</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, allowComments: !prev.allowComments }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                    formData.allowComments ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle comments"
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      formData.allowComments ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Schedule (optional) */}
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  id="schedule"
                  value={formData.scheduleDate}
                  onChange={(e) => 
setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload progress bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={
            uploading || 
            captionCount === 0 || 
            captionCount > MAX_CAPTION || 
            descriptionCount > MAX_DESCRIPTION ||
            (formData.postType === 'image' && !formData.image) ||
            (formData.postType === 'text' && !formData.textContent.trim())
          }
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {uploading ? (
            <>
              <Loader2 className="inline animate-spin mr-2" size={18} />
              Uploading...
            </>
          ) : (
            <>
              <CloudUpload className="inline mr-2" size={18} />
              Upload Meme
            </>
          )}
        </button>
      </form>

      {/* Professional Crop Modal */}
      {showCropModal && originalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200"
          onClick={() => setShowCropModal(false)}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close crop modal"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="relative h-96 bg-gray-900">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
<div className="px-4 py-3 bg-gray-50">
  <input
    type="range"
    min={1}
    max={3}
    step={0.1}
    value={zoom}
    onChange={(e) => setZoom(Number(e.target.value))}
    className="w-full"
  />
</div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={useOriginalImage}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition"
              >
                <ImageIcon className="inline mr-2" size={16} />
                Use Original
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createCroppedImage}
                  disabled={isApplyingCrop}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-all duration-200 min-w-[100px] flex items-center justify-center disabled:opacity-50"
                >
                  {isApplyingCrop ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Applying...
                    </>
                  ) : (
                    'Apply Crop'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;