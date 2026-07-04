'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Game } from '@/types';
import GameCard from './GameCard';

interface SortableGameCardProps {
  game: Game;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
  onDragStart?: () => void;
}

export default function SortableGameCard({ game, isAdmin, onEdit, onDelete, onViewDetail }: SortableGameCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: game.id,
    disabled: game.pinned || !isAdmin,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-game-card-wrapper">
      {/* แสดง badge ล็อคสำหรับเกมปักหมุด */}
      {game.pinned && isAdmin && (
        <div className="pin-locked-badge" title="ปักหมุด - ไม่สามารถลากได้">
          <i className="fas fa-lock"></i>
          <span>ล็อค</span>
        </div>
      )}

      <GameCard 
        game={game} 
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetail={onViewDetail}
        dragHandleProps={isAdmin && !game.pinned ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  );
}