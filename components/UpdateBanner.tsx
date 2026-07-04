'use client';

import { Update } from '@/types';
import { useLanguage } from './LanguageContext';
import AutoLinkText from './AutoLinkText';

interface UpdateBannerProps {
  latestUpdate: Update;
  isAdmin: boolean;
  onShowAll: () => void;
  onAddUpdate: () => void;
  onDelete?: () => void;
}

export default function UpdateBanner({ latestUpdate, isAdmin, onShowAll, onAddUpdate, onDelete }: UpdateBannerProps) {
  const { t } = useLanguage();
  const shortContent = latestUpdate.content.split('\n')[0];
  const displayContent = shortContent.length > 60 ? shortContent.substring(0, 60) + '...' : shortContent;

  return (
    <div className="update-banner" id="updateBanner">
      <div className="update-banner-left">
        <div className="update-banner-icon"><i className="fas fa-bullhorn"></i></div>
        <div className="update-banner-text">
          <h4>{latestUpdate.title}</h4>
          <p><AutoLinkText text={displayContent} /></p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button className="update-banner-btn" onClick={onShowAll}>
          <i className="fas fa-eye"></i> {t('update.viewAll')}
        </button>
        {isAdmin && (
          <div className="update-banner-admin">
            <button className="update-banner-btn" style={{ background: 'linear-gradient(135deg, var(--info), #0284c7)' }} onClick={onAddUpdate}>
              <i className="fas fa-plus"></i> {t('update.write')}
            </button>
            {onDelete && (
              <button className="update-banner-btn" style={{ background: 'linear-gradient(135deg, var(--danger), #b91c1c)' }} onClick={onDelete}>
                <i className="fas fa-trash"></i> {t('update.delete')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}