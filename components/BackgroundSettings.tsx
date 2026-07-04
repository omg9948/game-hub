'use client';

import { useState, useEffect } from 'react';

interface BackgroundSettingsProps {
  backgroundImage: string;
  onChange: (url: string) => void;
}

export default function BackgroundSettings({ backgroundImage, onChange }: BackgroundSettingsProps) {
  const [url, setUrl] = useState(backgroundImage || '');
  const [previewError, setPreviewError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setUrl(backgroundImage || '');
  }, [backgroundImage]);

  const handleSave = () => {
    onChange(url.trim());
    setShowPreview(false);
  };

  const handleClear = () => {
    setUrl('');
    onChange('');
    setPreviewError(false);
    setShowPreview(false);
  };

  const isValidUrl = url.trim().length > 0 && (url.startsWith('http://') || url.startsWith('https://'));

  const togglePreview = () => {
    if (!showPreview) setPreviewError(false);
    setShowPreview(!showPreview);
  };

  return (
    <div className="background-settings">
      <h4 className="background-settings-title">
        <i className="fas fa-image"></i> ตั้งค่าภาพพื้นหลัง
      </h4>

      <div className="background-info">
        <div className="background-info-item">
          <i className="fas fa-info-circle"></i>
          <span>ขนาดภาพแนะนำ: <strong>1920 x 1080</strong> (Full HD) หรือ <strong>2560 x 1440</strong> (2K)</span>
        </div>
        <div className="background-info-item">
          <i className="fas fa-file-image"></i>
          <span>รองรับ: JPG, PNG, WEBP, GIF (รวมถึง animated GIF)</span>
        </div>
        <div className="background-info-item">
          <i className="fas fa-compress"></i>
          <span>ขนาดไฟล์แนะนำ: ไม่เกิน 5MB เพื่อความเร็วในการโหลด</span>
        </div>
      </div>

      {backgroundImage ? (
        <div className="background-current-active">
          <div className="background-current-header">
            <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i>
            <span className="background-current-title">กำลังใช้งานอยู่</span>
          </div>
          <div className="background-current-url">
            {backgroundImage.length > 60 ? backgroundImage.substring(0, 60) + '...' : backgroundImage}
          </div>
          <div className="background-current-preview">
            <img src={backgroundImage} alt="Current background" />
          </div>
        </div>
      ) : (
        <div className="background-current-empty">
          <i className="fas fa-image" style={{ opacity: 0.3 }}></i>
          <span>ไม่มีภาพพื้นหลัง (ใช้พื้นหลังเริ่มต้น)</span>
        </div>
      )}

      <div className="background-input-group">
        <label className="background-input-label">
          <i className="fas fa-link"></i> ลิงก์ภาพพื้นหลังใหม่:
        </label>
        <input
          type="text"
          className="form-input"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setPreviewError(false);
            setShowPreview(false);
          }}
          placeholder="https://example.com/background.jpg หรือ .gif"
        />
        <div className="background-actions">
          <button
            type="button"
            className="admin-btn-small"
            onClick={handleSave}
            disabled={!isValidUrl && url.trim() !== ''}
          >
            <i className="fas fa-save"></i> บันทึก
          </button>
          {isValidUrl && (
            <button
              type="button"
              className={`admin-btn-small ${showPreview ? 'active' : ''}`}
              onClick={togglePreview}
            >
              <i className={`fas ${showPreview ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              {showPreview ? ' ซ่อนตัวอย่าง' : ' ดูตัวอย่าง'}
            </button>
          )}
          {(url || backgroundImage) && (
            <button
              type="button"
              className="admin-btn-small delete"
              onClick={handleClear}
            >
              <i className="fas fa-trash"></i> ลบรูป
            </button>
          )}
        </div>
      </div>

      {showPreview && isValidUrl && !previewError && (
        <div className="background-preview">
          <p className="background-preview-label">
            <i className="fas fa-eye"></i> ตัวอย่างภาพพื้นหลังใหม่:
          </p>
          <div className="background-preview-box">
            <img
              src={url}
              alt="Background preview"
              onError={() => setPreviewError(true)}
            />
          </div>
        </div>
      )}

      {showPreview && previewError && isValidUrl && (
        <div className="background-preview-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>ไม่สามารถโหลดภาพได้ กรุณาตรวจสอบลิงก์</span>
        </div>
      )}
    </div>
  );
}