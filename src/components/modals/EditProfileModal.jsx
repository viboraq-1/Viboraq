import React, { useEffect, useState } from 'react';
import ReactModal from '../common/ReactModal.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function EditProfileModal() {
  const { modal, profile, setProfile, notify } = useApp();
  const [form, setForm] = useState({ nickname: '', city: '', bio: '', meet: '', friend: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (modal?.name !== 'edit') return;
    setForm({ nickname: profile.nickname || '', city: profile.city || '', bio: profile.bio || '', meet: profile.meet || '', friend: profile.friend || '' });
    setPreview(profile.avatarUrl || '');
    setFile(null);
  }, [modal?.name, profile]);

  const save = () => {
    if (!form.nickname.trim() || !form.city.trim()) return notify('Name and city are required.', 'error');
    setProfile((current) => ({ ...current, ...form, nickname: form.nickname.trim(), city: form.city.trim(), avatarUrl: preview || current.avatarUrl }));
    notify('Profile settings synchronized successfully!');
  };

  return (
    <ReactModal name="edit" title="Edit Profile">
      <div className="vq-react-form">
        <label className="vq-field-label">DISPLAY NAME</label>
        <input className="input-txt" value={form.nickname} onChange={(e) => setForm((v) => ({ ...v, nickname: e.target.value }))} maxLength={40} />
        <label className="vq-field-label">CITY</label>
        <input className="input-txt" value={form.city} onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))} />
        <label className="vq-field-label">BIO</label>
        <textarea className="input-txt vq-textarea" value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} maxLength={180} placeholder="Tell people what you enjoy..." />
        <label className="vq-field-label">PROFILE PHOTO</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const selected = e.target.files?.[0]; if (!selected) return; setFile(selected); setPreview(URL.createObjectURL(selected)); }} />
        {preview && <div className="vq-edit-photo-preview" style={{ backgroundImage: `url(${preview})` }} aria-label="Profile preview" />}
        <label className="vq-field-label">MEET PREFERENCE</label>
        <select className="input-txt" value={form.meet} onChange={(e) => setForm((v) => ({ ...v, meet: e.target.value }))}><option value="">Select</option><option value="Women">Women</option><option value="Men">Men</option><option value="Everyone">Everyone</option></select>
        <label className="vq-field-label">FRIENDSHIP SCOPE</label>
        <select className="input-txt" value={form.friend} onChange={(e) => setForm((v) => ({ ...v, friend: e.target.value }))}><option value="">Select</option><option value="Only from my country">Only from my city</option><option value="Worldwide">All Pakistan Network</option></select>
        <button type="button" className="btn-connect" onClick={save}>Save Profile</button>
      </div>
    </ReactModal>
  );
}
