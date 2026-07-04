'use client';

import { useState, useEffect } from 'react';
import { Game, Category } from '@/types';
import { useLanguage } from '../LanguageContext';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  categories: Category[];
  onSubmit: (data: any) => void;
}

const icons = [
  'fas fa-gamepad', 'fas fa-ghost', 'fas fa-dragon', 'fas fa-dungeon',
  'fas fa-chess-knight', 'fas fa-puzzle-piece', 'fas fa-brain', 'fas fa-car',
  'fas fa-plane', 'fas fa-ship', 'fas fa-rocket', 'fas fa-user-ninja',
  'fas fa-skull', 'fas fa-crown', 'fas fa-gem', 'fas fa-star',
  'fas fa-fire', 'fas fa-bolt', 'fas fa-heart', 'fas fa-shield-alt',
  'fas fa-sword', 'fas fa-hat-wizard', 'fas fa-scroll', 'fas fa-dice-d20'
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

  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setCategory(game.category);
      setIcon(game.icon || '');
      setImage(game.image || '');
      setImages(game.images || []);
      setLink(game.link);
      setDescription(game.description || '');
    } else {
      setTitle('');
      setCategory('');
      setIcon('fas fa-gamepad');
      setImage('');
      setImages([]);
      setLink('');
      setDescription('');
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
      description
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

          <div className="form-group">
            <label className="form-label">{t('modal.icon')}</label>
            <div className="icon-grid">
              {icons.map(ic => (
                <button type="button" key={ic} className={`icon-btn ${icon === ic ? 'active' : ''}`} onClick={() => setIcon(ic)}>
                  <i className={ic}></i>
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

          {/* ช่องคำอธิบายใหญ่ขึ้น */}
          <div className="form-group">
            <label className="form-label">{t('modal.description')}</label>
            <textarea 
              className="form-input form-textarea-large" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder={t('modal.description')}
              rows={6}
            />
          </div>

          <button type="submit" className="form-submit"><i className="fas fa-save"></i> {t('modal.save')}</button>
        </form>
      </div>
    </div>
  );
}
