import React, { useState, useEffect, useRef } from 'react';
import { Settings, Paintbrush, Bell, Play, Shield, Eye, EyeOff, ChevronDown, Loader2, Check } from 'lucide-react';
import { useToast } from '../../admin/Contexts/ToastContexts';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const strengthMeta = [null, { label: 'Weak', color: 'bg-red-500' }, { label: 'Fair', color: 'bg-yellow-500' }, { label: 'Good', color: 'bg-blue-500' }, { label: 'Strong', color: 'bg-green-500' }];

const Toggle = ({ label, desc, value, setValue }) => (
  <div className="flex items-center justify-between py-1">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => setValue(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-orange-500' : 'bg-gray-200'}`}
      role="switch"
      aria-checked={value}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

const PasswordInput = ({ name, placeholder, value, onChange, show, toggle }) => (
  <div className="relative">
    <input
      type={show ? 'text' : 'password'} name={name} value={value} onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
    />
    <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
        <Icon size={16} className="text-orange-500" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="px-5 py-4 space-y-4">{children}</div>
  </div>
);

const UserSettings = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState('en');
  const [autoPlay, setAutoPlay] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saved, setSaved] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (s.darkMode !== undefined) setDarkMode(s.darkMode);
    if (s.emailNotifications !== undefined) setEmailNotifications(s.emailNotifications);
    if (s.pushNotifications !== undefined) setPushNotifications(s.pushNotifications);
    if (s.language) setLanguage(s.language);
    if (s.autoPlay !== undefined) setAutoPlay(s.autoPlay);
    if (s.twoFactor !== undefined) setTwoFactor(s.twoFactor);
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify({ darkMode, emailNotifications, pushNotifications, language, autoPlay, twoFactor }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.addToast('Settings saved', 'success');
  };

  const handleUpdatePassword = async () => {
    const { current, new: newPwd, confirm } = passwordData;
    if (!current || !newPwd || !confirm) { toast.addToast('Fill all password fields', 'error'); return; }
    if (newPwd !== confirm) { toast.addToast('Passwords do not match', 'error'); return; }
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsUpdating(false);
    toast.addToast('Password updated', 'success');
  };

  const strength = getStrength(passwordData.new);
  const sm = strengthMeta[strength];

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Settings size={18} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Settings</h1>
            <p className="text-xs text-gray-400">Manage your preferences</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'}`}
        >
          {saved ? <><Check size={14} /> Saved</> : 'Save changes'}
        </button>
      </div>

      <Section icon={Paintbrush} title="Appearance">
        <Toggle label="Dark Mode" desc="Switch to dark interface theme" value={darkMode} setValue={setDarkMode} />
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-gray-800">Language</p>
            <p className="text-xs text-gray-400 mt-0.5">Interface language</p>
          </div>
          <div ref={dropdownRef} className="relative w-36">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm hover:bg-gray-100 transition"
            >
              <span>{languageOptions.find((l) => l.value === language)?.label}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-full bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-10">
                {languageOptions.map((opt) => (
                  <button key={opt.value} onClick={() => { setLanguage(opt.value); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${language === opt.value ? 'text-orange-500 font-medium' : 'text-gray-700'}`}>
                    {opt.label}
                    {language === opt.value && <Check size={13} className="text-orange-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Toggle label="Email Notifications" desc="Receive updates via email" value={emailNotifications} setValue={setEmailNotifications} />
        <Toggle label="Push Notifications" desc="Browser push alerts" value={pushNotifications} setValue={setPushNotifications} />
      </Section>

      <Section icon={Play} title="Playback">
        <Toggle label="Auto-play Videos" desc="Automatically play videos in feed" value={autoPlay} setValue={setAutoPlay} />
      </Section>

      <Section icon={Shield} title="Security">
        <div className="space-y-3">
          <PasswordInput name="current" placeholder="Current password" value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
          <PasswordInput name="new" placeholder="New password" value={passwordData.new}
            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} show={showNew} toggle={() => setShowNew(!showNew)} />
          <PasswordInput name="confirm" placeholder="Confirm new password" value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />

          {passwordData.new && sm && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? sm.color : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${sm.color.replace('bg-', 'text-')}`}>{sm.label}</p>
            </div>
          )}

          <button
            onClick={handleUpdatePassword}
            disabled={isUpdating || !passwordData.current || !passwordData.new || !passwordData.confirm}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 disabled:opacity-40 hover:bg-orange-600 transition"
          >
            {isUpdating && <Loader2 size={14} className="animate-spin" />}
            Update password
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Toggle label="Two-factor Authentication" desc="Add an extra layer of security" value={twoFactor} setValue={setTwoFactor} />
        </div>
      </Section>
    </div>
  );
};

export default UserSettings;
