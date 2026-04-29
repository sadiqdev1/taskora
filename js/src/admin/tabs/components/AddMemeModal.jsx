import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  X, CloudUpload, ChevronDown, Check, Tag, Star,
  AlertTriangle, Calendar, Image as ImageIcon, User,
  Hash, Sparkles,
} from 'lucide-react';

/* ─── Reusable Select ─────────────────────────────────────────── */
const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between text-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
        >
          <span className="text-gray-800 capitalize">{value}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-30 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 max-h-52 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors capitalize ${
                  value === opt ? 'text-orange-600 bg-orange-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt}
                {value === opt && <Check size={13} className="text-orange-500 flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Toggle Switch ───────────────────────────────────────────── */
const Toggle = ({ label, desc, icon: Icon, iconColor, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
        <Icon size={15} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

/* ─── Section Header ──────────────────────────────────────────── */
const SectionLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon size={14} className="text-orange-500" />
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
  </div>
);

/* ─── Main Modal ──────────────────────────────────────────────── */
const AddMemeModal = ({
  isOpen, onClose,
  formData, setFormData,
  categoryDropdownOpen, setCategoryDropdownOpen,
  statusDropdownOpen, setStatusDropdownOpen,
  categoryDropdownRef, statusDropdownRef,
  onImageChange, onAddTag, onRemoveTag, onTagKeyDown,
  onSuggestionClick, onSubmit,
  categoryOptions, tagSuggestions,
}) => {
  const modalRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  /* ESC + scroll lock */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  /* Drag & drop */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = { target: { files: [file] } };
      onImageChange(syntheticEvent);
    }
  }, [onImageChange]);

  if (!isOpen) return null;

  const statusColors = { pending: 'text-yellow-600', approved: 'text-green-600', rejected: 'text-red-600' };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); }}
      style={{ animation: 'mBgIn .2s ease' }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-gray-100"
        style={{ animation: 'mIn .22s cubic-bezier(.16,1,.3,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <ImageIcon size={17} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Add New Meme</h2>
              <p className="text-xs text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Image Upload ── */}
          <div>
            <SectionLabel icon={ImageIcon} label="Meme Image" />
            {formData.imagePreview ? (
              <div className="relative group w-full">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-xl border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label htmlFor="image-upload-replace" className="cursor-pointer px-3 py-2 bg-white/90 text-gray-800 rounded-lg text-xs font-semibold hover:bg-white transition">
                    Replace
                    <input type="file" id="image-upload-replace" accept="image/*" onChange={onImageChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                    className="px-3 py-2 bg-red-500/90 text-white rounded-lg text-xs font-semibold hover:bg-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragActive
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
                }`}
              >
                <CloudUpload size={32} className={`mb-2 transition-colors ${dragActive ? 'text-orange-500' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-600">
                  {dragActive ? 'Drop it here' : 'Click or drag & drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                <input type="file" id="image-upload" accept="image/*" onChange={onImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* ── Details ── */}
          <div>
            <SectionLabel icon={User} label="Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="caption" className="block text-xs font-medium text-gray-600 mb-1.5">Caption <span className="text-red-400">*</span></label>
                <input
                  id="caption"
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Write a funny caption..."
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-xs font-medium text-gray-600 mb-1.5">Author <span className="text-red-400">*</span></label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="@username"
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
                />
              </div>
            </div>
          </div>

          {/* ── Category & Status ── */}
          <div>
            <SectionLabel icon={Sparkles} label="Classification" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Category"
                value={formData.category}
                options={categoryOptions}
                onChange={(val) => setFormData({ ...formData, category: val })}
              />
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <div className="flex gap-2">
                  {['pending', 'approved', 'rejected'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        formData.status === s
                          ? s === 'approved' ? 'bg-green-500 text-white border-green-500'
                          : s === 'rejected' ? 'bg-red-500 text-white border-red-500'
                          : 'bg-yellow-500 text-white border-yellow-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tags ── */}
          <div>
            <SectionLabel icon={Hash} label="Tags" />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {formData.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium">
                    #{tag}
                    <button type="button" onClick={() => onRemoveTag(tag)} className="text-orange-400 hover:text-orange-700 transition ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                  onKeyDown={onTagKeyDown}
                  placeholder="Type a tag and press Enter"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
                />
              </div>
              <button
                type="button"
                onClick={onAddTag}
                className="px-4 py-2.5 bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-200 transition"
              >
                Add
              </button>
            </div>
            {formData.tagInput.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <p className="w-full text-xs text-gray-400 mb-1">Suggestions:</p>
                {tagSuggestions
                  .filter((s) => s.includes(formData.tagInput.toLowerCase()) && !formData.tags.includes(s))
                  .slice(0, 6)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onSuggestionClick(s)}
                      className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-full transition"
                    >
                      #{s}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* ── Options ── */}
          <div>
            <SectionLabel icon={Star} label="Options" />
            <div className="space-y-2">
              <Toggle
                label="Feature this meme"
                desc="Pin to the featured section"
                icon={Star}
                iconColor="bg-yellow-50 text-yellow-500"
                checked={formData.featured}
                onChange={(val) => setFormData({ ...formData, featured: val })}
              />
              <Toggle
                label="NSFW"
                desc="Mark as mature / 18+ content"
                icon={AlertTriangle}
                iconColor="bg-red-50 text-red-500"
                checked={formData.nsfw}
                onChange={(val) => setFormData({ ...formData, nsfw: val })}
              />
            </div>
          </div>

          {/* ── Schedule ── */}
          <div>
            <SectionLabel icon={Calendar} label="Schedule (optional)" />
            <input
              type="datetime-local"
              value={formData.scheduledPublish}
              onChange={(e) => setFormData({ ...formData, scheduledPublish: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
            />
            {formData.scheduledPublish && (
              <p className="text-xs text-orange-600 mt-1.5 flex items-center gap-1">
                <Calendar size={11} />
                Scheduled for {new Date(formData.scheduledPublish).toLocaleString()}
              </p>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50 rounded-b-2xl">
          <p className="text-xs text-gray-400">
            <span className="text-red-400">*</span> Required fields
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-meme-form"
              onClick={onSubmit}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition shadow-sm flex items-center gap-2"
            >
              <ImageIcon size={14} />
              Add Meme
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mBgIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mIn { from { opacity: 0; transform: scale(.96) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>,
    document.body
  );
};

export default AddMemeModal;
