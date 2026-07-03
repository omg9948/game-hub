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

export default function GameModal({ isOpen, onClose, game, categories, onSubmit }: GameModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]); // รูปเพิ่มเติมหลายรูป
  const [newImageUrl, setNewImageUrl] = useState(''); // สำหรับเพิ่มรูปใหม่
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fas fa-gamepad');

  useEffect(() => {
    if (isOpen) {
      if (game) {
        setTitle(game.title);
        setCategory(game.category);
        setImage(game.image || '');
        setImages(game.images || []);
        setLink(game.link);
        setDescription(game.description || '');
        setIcon(game.icon);
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
      category,
      image: image.trim(),
      images: images.filter(Boolean), // ส่งรูปเพิ่มเติมไปด้วย
      link: link.trim(),
      description: description, // ไม่ trim เพื่อรักษาเว้นวรรค/enter
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
            <label className="form-label">หมวดหมู่ *</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">เลือกหมวดหมู่...</option>
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* รูปภาพหลัก */}
          <div className="form-group">
            <label className="form-label">ลิงก์รูปภาพหลัก (URL)</label>
            <input type="url" className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          {/* รูปภาพเพิ่มเติมหลายรูป */}
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              ใส่ลิงก์รูปภาพแล้วกด Enter หรือปุ่มเพิ่มรูป (เพิ่มได้หลายรูป)
            </p>

            {/* แสดงรูปที่เพิ่มแล้ว */}
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              ข้อความจะแสดงตามที่พิมพ์เป๊ะๆ รวมถึงการเว้นวรรคและขึ้นบรรทัดใหม่
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">ไอคอน (Font Awesome class)</label>
            <input type="text" className="form-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="fas fa-gamepad" />
          </div>

          <button type="submit" className="form-submit">
            <i className={game ? 'fas fa-save' : 'fas fa-plus'}></i> {game ? 'บันทึกการแก้ไข' : 'เพิ่มเกม'}
          </button>
        </form>
      </div>
    </div>
  );
}