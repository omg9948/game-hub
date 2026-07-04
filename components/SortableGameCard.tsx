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
}

export default function SortableGameCard({ game, isAdmin, onEdit, onDelete, onViewDetail }: SortableGameCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id, disabled: !isAdmin || game.pinned });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
      className="sortable-game-card-wrapper"
    >
      {isAdmin && !game.pinned && (
        <div
          className="drag-handle"
          {...attributes}
          {...listeners}
          role="button"
          tabIndex={0}
          aria-label="ลากเพื่อเรียงลำดับ"
        >
          <i className="fas fa-grip-lines"></i>
          <span className="drag-hint">ลากเรียง</span>
        </div>
      )}
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