'use client';

interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ title, message, type, onClose }: ToastProps) {
  return (
    <div className={`toast ${type} show`}>
      <div className="toast-icon">
        <i className={`fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-circle'}`}></i>
      </div>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
}
