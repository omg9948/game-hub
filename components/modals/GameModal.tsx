'use client';

import { useState, useEffect, useRef } from 'react';
import { Game, Category } from '@/types';
import { useLanguage } from '@/components/LanguageContext';
import TextToolbar from '@/components/TextToolbar';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  categories: Category[];
  onSubmit: (data: any) => void;
}

const icons = [
  { class: 'fas fa-gamepad', label: 'Gamepad' },
  { class: 'fas fa-ghost', label: 'Ghost' },
  { class: 'fas fa-dragon', label: 'Dragon' },
  { class: 'fas fa-dungeon', label: 'Dungeon' },
  { class: 'fas fa-chess-knight', label: 'Knight' },
  { class: 'fas fa-puzzle-piece', label: 'Puzzle' },
  { class: 'fas fa-brain', label: 'Brain' },
  { class: 'fas fa-car', label: 'Car' },
  { class: 'fas fa-plane', label: 'Plane' },
  { class: 'fas fa-ship', label: 'Ship' },
  { class: 'fas fa-rocket', label: 'Rocket' },
  { class: 'fas fa-user-ninja', label: 'Ninja' },
  { class: 'fas fa-skull', label: 'Skull' },
  { class: 'fas fa-crown', label: 'Crown' },
  { class: 'fas fa-gem', label: 'Gem' },
  { class: 'fas fa-star', label: 'Star' },
  { class: 'fas fa-fire', label: 'Fire' },
  { class: 'fas fa-bolt', label: 'Bolt' },
  { class: 'fas fa-heart', label: 'Heart' },
  { class: 'fas fa-shield-alt', label: 'Shield' },
  { class: 'fas fa-sword', label: 'Sword' },
  { class: 'fas fa-hat-wizard', label: 'Wizard' },
  { class: 'fas fa-scroll', label: 'Scroll' },
  { class: 'fas fa-dice-d20', label: 'Dice' }
];

export default function GameModal({ isOpen, onClose, game, categories, onSubmit }: GameModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('fas fa-gamepad');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [pinned, setPinned] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setCategory(game.category);
      setIcon(game.icon || 'fas fa-gamepad');
      setImage(game.image || '');
      setImages(game.images || []);
      setLink(game.link);
      setDescription(game.description || '');
      setPinned(game.pinned || false);
    } else {
      setTitle('');
      setCategory('');
      setIcon('fas fa-gamepad');
      setImage('');
      setImages([]);
      setLink('');
      setDescription('');
      setPinned(false);
    }
  }, [game, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: game?.id,
      title,
      category: category || 'Other',
      icon,
      image,
      images: images.filter(Boolean),
      link,
      description,
      pinned
    });
  };

  const addImage = () => setImages([...images, '']);
  const updateImage = (i: number, val: string) => {
    const newImages = [...images];
    newImages[i] = val;
    setImages(newImages);
  };
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-gamepad"></i> {game ? t('modal.editGame') : t('modal.addGame')}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t('modal.gameName')}</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.category')}</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">{t('modal.noCategory')}</option>
              {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          {/* Pin Toggle */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className="fas fa-thumbtack"></i> ปักหมุดเกม
            </label>
            <div className="pin-toggle-wrapper">
              <button
                type="button"
                className={`pin-toggle-btn ${pinned ? 'pinned' : ''}`}
                onClick={() => setPinned(!pinned)}
              >
                <span className="pin-toggle-track">
                  <span className="pin-toggle-thumb"></span>
                </span>
                <span className="pin-toggle-text">
                  {pinned ? (
                    <><i className="fas fa-thumbtack"></i> ปักหมุดแล้ว (แสดงแรกสุด)</>
                  ) : (
                    <><i className="fas fa-thumbtack" style={{ opacity: 0.4 }}></i> ไม่ปักหมุด</>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.icon')}</label>
            <div className="icon-grid">
              {icons.map(ic => (
                <button 
                  type="button" 
                  key={ic.class} 
                  className={`icon-btn ${icon === ic.class ? 'active' : ''}`} 
                  onClick={() => setIcon(ic.class)}
                  data-tooltip={ic.label}
                  title={ic.label}
                >
                  <i className={ic.class}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.imageUrl')}</label>
            <input className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.moreImages')}</label>
            {images.map((img, i) => (
              <div key={i} className="image-input-row">
                <input className="form-input" value={img} onChange={e => updateImage(i, e.target.value)} placeholder="https://..." />
                <button type="button" className="admin-btn-small delete" onClick={() => removeImage(i)}><i className="fas fa-trash"></i></button>
              </div>
            ))}
            <button type="button" className="add-image-btn" onClick={addImage}><i className="fas fa-plus"></i> {t('modal.addImage')}</button>
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.gameLink')}</label>
            <input className="form-input" value={link} onChange={e => setLink(e.target.value)} required placeholder="https://..." />
          </div>

          {/* ช่องคำอธิบายใหญ่ขึ้น + TextToolbar */}
          <div className="form-group">
            <label className="form-label">{t('modal.description')}</label>
            <div className="textarea-with-toolbar">
              <textarea 
                ref={descRef}
                className="form-input form-textarea-large" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder={t('modal.description')}
                rows={6}
              />
              <TextToolbar 
                textareaRef={descRef} 
                value={description}
                onChange={setDescription}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <i className="fas fa-mouse-pointer"></i> ลากคลุมข้อความเพื่อตั้งค่า Bold, Italic, Underline, Strikethrough, Quote, Code, Spoiler
            </p>
          </div>

          <button type="submit" className="form-submit"><i className="fas fa-save"></i> {t('modal.save')}</button>
        </form>
      </div>
    </div>
  );
}