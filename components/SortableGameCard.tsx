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
  canMoveUp,
  canMoveDown
}: SortableGameCardProps) {
  return (
    <div className="sortable-game-card-wrapper">
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
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
    </div>
  );
}