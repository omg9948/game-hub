'use client';

import { useState, useEffect } from 'react';
import { Game, Category } from '@/types';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  categories: Category[];
  onSubmit: (data: any) => void;
}

// ไอคอนให้เลือก
const GAME_ICONS = [
  { class: 'fas fa-gamepad', name: 'Gamepad' },
  { class: 'fas fa-crown', name: 'Crown' },
  { class: 'fas fa-rocket', name: 'Rocket' },
  { class: 'fas fa-brain', name: 'Brain' },
  { class: 'fas fa-chess-king', name: 'Chess' },
  { class: 'fas fa-car', name: 'Car' },
  { class: 'fas fa-city', name: 'City' },
  { class: 'fas fa-dragon', name: 'Dragon' },
  { class: 'fas fa-ghost', name: 'Ghost' },
  { class: 'fas fa-map', name: 'Map' },
  { class: 'fas fa-users', name: 'Users' },
  { class: 'fas fa-dice', name: 'Dice' },
  { class: 'fas fa-sword', name: 'Sword' },
  { class: 'fas fa-shield-alt', name: 'Shield' },
  { class: 'fas fa-star', name: 'Star' },
  { class: 'fas fa-gem', name: 'Gem' },
  { class: 'fas fa-magic', name: 'Magic' },
  { class: 'fas fa-skull', name: 'Skull' },
  { class: 'fas fa-robot', name: 'Robot' },
  { class: 'fas fa-puzzle-piece', name: 'Puzzle' },
  { class: 'fas fa-trophy', name: 'Trophy' },
  { class: 'fas fa-flag', name: 'Flag' },
  { class: 'fas fa-bomb', name: 'Bomb' },
  { class: 'fas fa-fire', name: 'Fire' },
];

export default function GameModal({ isOpen, onClose, game, categories, onSubmit }: GameModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fas fa-gamepad');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (game) {
        setTitle(game.title);
        setCategory(game.category || '');
        setImage(game.image || '');
        setImages(game.images || []);
        setLink(game.link);
        setDescription(game.description || '');
        setIcon(game.icon || 'fas fa-gamepad');
      } else {
        setTitle('');
        setCategory('');
        setImage('');
        setImages([]);
        setLink('');
        setDescription('');
        setIcon('fas fa-gamepad');
      }
      setNewImageUrl('');
      setShowIconPicker(false);
    }
  }, [isOpen, game]);

  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: game?.id,
      title: title.trim(),
      category: category || 'Other', // ถ้าไม่เลือกให้เป็น Other
      image: image.trim(),
      images: images.filter(Boolean),
      link: link.trim(),
      description: description,
      icon: icon.trim() || 'fas fa-gamepad'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title">{game ? 'แก้ไขเกม' : 'เพิ่มเกมใหม่'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ชื่อเกม *</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="ชื่อเกม..." required />
          </div>

          <div className="form-group">
            <label className="form-label">หมวดหมู่ (ไม่บังคับ)</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">ไม่มีหมวดหมู่ (Other)</option>
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* ไอคอน - เลือกได้ */}
          <div className="form-group">
            <label className="form-label">ไอคอน</label>
            <div className="icon-picker">
              <button type="button" className="icon-selected" onClick={() => setShowIconPicker(!showIconPicker)}>
                <i className={icon}></i>
                <span>เลือกไอคอน</span>
                <i className={`fas fa-chevron-${showIconPicker ? 'up' : 'down'}`}></i>
              </button>
              {showIconPicker && (
                <div className="icon-grid">
                  {GAME_ICONS.map((ic) => (
                    <button
                      key={ic.class}
                      type="button"
                      className={`icon-item ${icon === ic.class ? 'active' : ''}`}
                      onClick={() => { setIcon(ic.class); setShowIconPicker(false); }}
                      title={ic.name}
                    >
                      <i className={ic.class}></i>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* รูปภาพหลัก */}
          <div className="form-group">
            <label className="form-label">ลิงก์รูปภาพหลัก (URL)</label>
            <input type="url" className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          {/* รูปภาพเพิ่มเติม */}
          <div className="form-group">
            <label className="form-label">รูปภาพเพิ่มเติม (หลายรูป)</label>
            <div className="image-input-group">
              <input 
                type="url" 
                className="form-input" 
                value={newImageUrl} 
                onChange={e => setNewImageUrl(e.target.value)} 
                placeholder="https://example.com/screenshot1.jpg"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              />
              <button type="button" className="add-image-btn" onClick={handleAddImage}>
                <i className="fas fa-plus"></i> เพิ่มรูป
              </button>
            </div>

            {images.length > 0 && (
              <div className="image-preview-list">
                {images.map((img, idx) => (
                  <div key={idx} className="image-preview-item">
                    <img src={img} alt={`รูป ${idx + 1}`} />
                    <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(idx)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">ลิงก์ไฟล์เกม *</label>
            <input type="url" className="form-input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." required />
          </div>

          <div className="form-group">
            <label className="form-label">คำอธิบาย</label>
            <textarea 
              className="form-textarea" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="คำอธิบายเกม... (กด Enter เพื่อขึ้นบรรทัดใหม่)"
              rows={6}
            />
          </div>

          <button type="submit" className="form-submit">
            <i className={game ? 'fas fa-save' : 'fas fa-plus'}></i> {game ? 'บันทึกการแก้ไข' : 'เพิ่มเกม'}
          </button>
        </form>
      </div>
    </div>
  );
}