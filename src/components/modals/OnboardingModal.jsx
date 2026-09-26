import React, { useEffect, useMemo, useState } from 'react';
import ReactModal from '../common/ReactModal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { EMAIL_PATTERN, getAge, isStrongPassword, signUpAccount, validatePassword } from '../../services/auth.js';
import { INTEREST_CATEGORIES } from '../../data/interests.js';
import { PAK_CITIES } from '../../data/cities.js';

const TOTAL_STEPS = 10;
const initialLocal = {
  nickname: '', dob: '', gender: '', city: '', meet: '', friend: '', email: '',
  interests: [], profileFile: null, profilePreview: '',
};

function ErrorText({ children }) {
  return <div className="vq18-form-error" role="alert"><span>!</span><div><b>One small check</b><p>{children}</p></div></div>;
}

export default function OnboardingModal() {
  const {
    modal, onboardingStep, setOnboardingStep, onboardingData, updateOnboarding,
    resetOnboarding, closeModal, notify, setProfile,
  } = useApp();
  const [local, setLocal] = useState({ ...initialLocal, ...onboardingData });
  const [error, setError] = useState('');
  const [interestSearch, setInterestSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modal?.name !== 'onboarding') return;
    if (modal.reset) {
      const fresh = { ...initialLocal };
      setLocal(fresh);
      setError('');
      setInterestSearch('');
      setShowPassword(false);
      setLoading(false);
      setOnboardingStep(1);
      resetOnboarding();
    } else {
      setLocal({ ...initialLocal, ...onboardingData });
    }
  }, [modal?.name, modal?.reset]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modal?.name === 'onboarding') {
      setLocal((current) => ({ ...current, ...onboardingData }));
    }
  }, [onboardingData, modal?.name]);

  const update = (patch) => {
    setLocal((current) => ({ ...current, ...patch }));
    setError('');
  };

  const passwordRules = useMemo(() => validatePassword(local.password || ''), [local.password]);
  const filteredCategories = useMemo(() => {
    const query = interestSearch.trim().toLowerCase();
    if (!query) return INTEREST_CATEGORIES;
    return INTEREST_CATEGORIES.map((category) => ({
      ...category,
      items: category.items.filter((item) => item.toLowerCase().includes(query)),
    })).filter((category) => category.items.length > 0);
  }, [interestSearch]);

  const validateStep = () => {
    const value = local;
    if (onboardingStep === 1 && !value.nickname.trim()) return 'Please enter your nickname!';
    if (onboardingStep === 2) {
      if (!value.dob) return 'Please select your birthday!';
      const age = getAge(value.dob);
      if (!Number.isFinite(age)) return 'Please select a valid birthday!';
      if (age < 14) return 'You must be at least 14 years old!';
      if (age > 70) return 'Age cannot exceed 70 years!';
    }
    if (onboardingStep === 3 && !value.gender) return 'Please select your gender!';
    if (onboardingStep === 4 && !value.city.trim()) return 'Please select or enter your city!';
    if (onboardingStep === 5 && !value.meet) return 'Please select your preference!';
    if (onboardingStep === 6 && !value.friend) return 'Please select your friend scope!';
    if (onboardingStep === 7) {
      if (!EMAIL_PATTERN.test(value.email.trim().toLowerCase())) return 'Please enter a valid email address!';
      if (!isStrongPassword(value.password || '')) return 'Password must meet all security checklist requirements!';
    }
    if (onboardingStep === 9 && value.interests.length !== 10) return 'Please select exactly 10 interests!';
    if (onboardingStep === 10 && !value.profileFile) return 'Please upload a profile picture!';
    return '';
  };

  const goNext = async () => {
    if (loading) return;
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    updateOnboarding(local);
    if (onboardingStep < TOTAL_STEPS) {
      setOnboardingStep((step) => step + 1);
      setError('');
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await signUpAccount({
      email: local.email,
      password: local.password,
      metadata: {
        nickname: local.nickname.trim(),
        city: local.city.trim(),
        gender: local.gender,
        meet: local.meet,
        friend: local.friend,
        dob: local.dob,
        interests: local.interests,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message.includes('already registered')
        ? 'This email is already registered. Please sign in instead.'
        : `Account creation failed: ${signUpError.message}`);
      return;
    }

    const preview = local.profilePreview || '';
    setProfile({
      nickname: local.nickname.trim(),
      city: local.city.trim(),
      meet: local.meet,
      friend: local.friend,
      email: local.email.trim().toLowerCase(),
      bio: '',
      interests: local.interests,
      avatarUrl: preview,
    });
    closeModal();
    resetOnboarding();

    if (data?.session) {
      setOnboardingStep(1);
      notify('Elite profile successfully created & verified!');
    } else {
      notify('Account created. Please verify your email, then sign in.', 'info');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    if (event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    goNext();
  };

  const goBack = () => {
    if (loading) return;
    setError('');
    if (onboardingStep > 1) setOnboardingStep((step) => step - 1);
    else closeModal();
  };

  const toggleInterest = (interest) => {
    const exists = local.interests.includes(interest);
    if (exists) {
      update({ interests: local.interests.filter((item) => item !== interest) });
    } else if (local.interests.length >= 10) {
      setError('You can select only 10 interests.');
    } else {
      update({ interests: [...local.interests, interest] });
    }
  };

  const removeInterest = (interest) => update({ interests: local.interests.filter((item) => item !== interest) });

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be 5MB or smaller.');
      return;
    }
    const preview = URL.createObjectURL(file);
    update({ profileFile: file, profilePreview: preview });
  };

  const titles = [
    'Hey! What Should I Call You?', 'What is your birthday?', 'Select your gender',
    'Where do you live?', 'Who do you want to meet?', 'Friendship scope',
    'Secure your account', 'Credentials Verified', 'Select your passions', 'Upload profile photo',
  ];

  return (
    <ReactModal name="onboarding" title={null} onRequestClose={closeModal}>
      <div className="vq-onboarding" onKeyDown={handleKeyDown}>
        <div className="vq-onboarding-progress" aria-label={`Step ${onboardingStep} of ${TOTAL_STEPS}`}>
          <div className="vq18-onboarding-head"><div><span>VIBORAQ · CREATE PROFILE</span><h2>{titles[onboardingStep - 1]}</h2></div><b>{onboardingStep}/{TOTAL_STEPS}</b></div><div className="vq-onboarding-progress__label">Profile setup</div>
          <div className="vq-onboarding-progress__track"><span style={{ width: `${onboardingStep * 10}%` }} /></div>
        </div>

        <div className="vq-onboarding-body">
          {onboardingStep === 1 && <div className="vq-step"><p className="vq-form-help">This is how you will appear to other verified activity partners.</p><input autoFocus className="input-txt" type="text" value={local.nickname} maxLength={40} placeholder="e.g. Waqas" onChange={(e) => update({ nickname: e.target.value })} /></div>}

          {onboardingStep === 2 && <div className="vq-step"><p className="vq-form-help">Age must be between 14 and 70 years.</p><input autoFocus className="input-txt" type="date" value={local.dob} max={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().slice(0, 10)} min={new Date(new Date().setFullYear(new Date().getFullYear() - 70)).toISOString().slice(0, 10)} onChange={(e) => update({ dob: e.target.value })} /></div>}

          {onboardingStep === 3 && <ChoiceList options={[['Woman','Woman'],['Man','Man']]} value={local.gender} onChange={(gender) => update({ gender })} />}

          {onboardingStep === 4 && <div className="vq-step"><p className="vq-form-help">Select your city from our verified Pakistan network.</p><input autoFocus className="input-txt" list="pak-cities-v5" value={local.city} placeholder="Search or select your city..." onChange={(e) => update({ city: e.target.value })} /><datalist id="pak-cities-v5">{PAK_CITIES.map((city) => <option key={city} value={city} />)}</datalist></div>}

          {onboardingStep === 5 && <ChoiceList options={[['Women','Women Partners'],['Men','Men Partners'],['Everyone','Everyone']]} value={local.meet} onChange={(meet) => update({ meet })} />}

          {onboardingStep === 6 && <ChoiceList options={[['Only from my country','Only from my city'],['Worldwide','All Pakistan Network']]} value={local.friend} onChange={(friend) => update({ friend })} />}

          {onboardingStep === 7 && <div className="vq-step"><p className="vq-form-help">Provide your email and a strong password.</p><input autoFocus className="input-txt" type="email" autoComplete="email" value={local.email} placeholder="name@example.com" onChange={(e) => update({ email: e.target.value })} /><div className="vq-password-wrap"><input className="input-txt" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={local.password || ''} placeholder="Secure password" onChange={(e) => update({ password: e.target.value })} /><button type="button" className="vq-password-toggle" onClick={() => setShowPassword((v) => !v)}>{showPassword ? '🙈' : '👁️'}</button></div><div className="vq-password-hints">{[['length','Length: 6 to 12 characters'],['upper','At least one Uppercase letter (A-Z)'],['lower','At least one Lowercase letter (a-z)'],['number','At least one Number (0-9)'],['symbol','At least one Symbol (!@#$%^&*)']].map(([key,text]) => <span key={key} className={passwordRules[key] ? 'valid' : ''}>{passwordRules[key] ? '✓ ' : '✗ '}{text}</span>)}</div></div>}

          {onboardingStep === 8 && <div className="vq-confirm-step"><div className="vq-confirm-icon">✓</div><h3>Credentials Ready</h3><p>Your account details passed the local validation checks. Continue to select your interests.</p><div className="vq-confirm-summary"><span>{local.email}</span><span>••••••••</span></div></div>}

          {onboardingStep === 9 && <div className="vq-step"><p className="vq-form-help">Choose exactly 10 interests <strong>{local.interests.length}/10</strong>.</p><div className="vq-selected-interests">{local.interests.map((interest) => <button type="button" key={interest} onClick={() => removeInterest(interest)}>{interest} ×</button>)}</div><input className="input-txt" type="search" value={interestSearch} placeholder="Search interests..." onChange={(e) => setInterestSearch(e.target.value)} /><div className="vq-interest-list">{filteredCategories.map((category) => <div key={category.name} className="vq-interest-category"><h4>{category.icon} {category.name}</h4><div className="vq-interest-options">{category.items.map((interest) => <button type="button" key={interest} className={local.interests.includes(interest) ? 'selected' : ''} onClick={() => toggleInterest(interest)}>{interest}</button>)}</div></div>)}</div></div>}

          {onboardingStep === 10 && <div className="vq-photo-step"><p className="vq-form-help">Ensure your face is clearly visible for elite verification.</p><input id="vq-profile-photo" type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePhoto} /><label htmlFor="vq-profile-photo" className={`vq-profile-upload ${local.profilePreview ? 'has-image' : ''}`} style={local.profilePreview ? { backgroundImage: `url(${local.profilePreview})` } : undefined}>{!local.profilePreview && <span>+</span>}</label>{local.profileFile && <p className="vq-photo-name">{local.profileFile.name}</p>}</div>}
        </div>

        {error && <ErrorText>{error}</ErrorText>}
        <div className="vq-onboarding-actions"><button type="button" className="btn-connect vq-secondary-btn" onClick={goBack} disabled={loading}>{onboardingStep === 1 ? 'Cancel' : 'Back'}</button><button type="button" className="btn-connect vq18-next-btn" onClick={goNext} disabled={loading}>{loading ? 'Creating account…' : onboardingStep === TOTAL_STEPS ? 'Create Account' : 'Continue'} <span>→</span></button></div>
      </div>
    </ReactModal>
  );
}

function ChoiceList({ options, value, onChange }) {
  return <div className="vq-choice-list">{options.map(([optionValue, label]) => <button key={optionValue} type="button" className={`vq-choice ${value === optionValue ? 'selected' : ''}`} onClick={() => onChange(optionValue)}>{label}</button>)}</div>;
}
