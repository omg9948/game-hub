'use client';

import { Game } from '@/types';
import GameCard from './GameCard';

interface SortableGameCardProps {
  game: Game;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function SortableGameCard({ 
  game, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onViewDetail,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true
}: SortableGameCardProps) {
  return (
    <div className="sortable-game-card-wrapper">
      {/* ปุ่มลูกศรเลื่อนขึ้น/ลง สำหรับ Admin */}
      {isAdmin && !game.pinned && (
        <div className="move-controls">
          <button 
            className="move-btn move-up" 
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="เลื่อนขึ้น"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <button 
            className="move-btn move-down" 
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="เลื่อนลง"
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
      )}

      {/* Badge ปักหมุดสำหรับ Admin */}
      {isAdmin && game.pinned && (
        <div className="pin-locked-badge">
          <i className="fas fa-lock"></i>
          <span>ปักหมุด</span>
        </div>
      )}

      <GameCard
        game={game}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetail={onViewDetail}
      />
    </div>
  );
}