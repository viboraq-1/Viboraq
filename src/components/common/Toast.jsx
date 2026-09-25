import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
export default function Toast(){ const {toast}=useApp(); if(!toast)return null; return <div className={`custom-toast vq-toast-${toast.type}`} role="status"><span>{toast.type==='error'?'✕':toast.type==='info'?'ℹ':'✓'}</span><span>{toast.message}</span></div>; }
