'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';

interface BackgroundSettingsProps {
  backgroundImage: string;
  onChange: (url: string) => void;
}

export default function BackgroundSettings({ backgroundImage, onChange }: BackgroundSettingsProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState(backgroundImage || '');
  const [previewError, setPreviewError] = useState(false);

  const handleSave = () => {
    onChange(url.trim());
  };

  const handleClear = () => {
    setUrl('');
    onChange('');
    setPreviewError(false);
  };

  const isValidUrl = url.trim().length > 0 && (url.startsWith('http://') || url.startsWith('https://'));

  return (
    <div className="background-settings">
      <h4 className="background-settings-title">
        <i className="fas fa-image"></i> {t('admin.backgroundTitle') || 'ตั้งค่าภาพพื้นหลัง'}
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

      <div className="background-input-group">
        <input
          type="text"
          className="form-input"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setPreviewError(false);
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
          {(url || backgroundImage) && (
            <button
              type="button"
              className="admin-btn-small delete"
              onClick={handleClear}
            >
              <i className="fas fa-trash"></i> ลบ
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {isValidUrl && !previewError && (
        <div className="background-preview">
          <p className="background-preview-label">
            <i className="fas fa-eye"></i> ตัวอย่างภาพพื้นหลัง:
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

      {previewError && isValidUrl && (
        <div className="background-preview-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>ไม่สามารถโหลดภาพได้ กรุณาตรวจสอบลิงก์</span>
        </div>
      )}

      {/* Current background indicator */}
      {backgroundImage && (
        <div className="background-current">
          <i className="fas fa-check-circle"></i>
          <span>กำลังใช้งาน: {backgroundImage.length > 50 ? backgroundImage.substring(0, 50) + '...' : backgroundImage}</span>
        </div>
      )}
    </div>
  );
}
