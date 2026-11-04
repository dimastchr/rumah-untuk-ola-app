import React, { useRef, useState } from 'react';

/**
 * Benda yang bisa diseret dengan jari (sentuh) atau tetikus memakai Pointer Events,
 * dan tetap bisa dipakai dengan ketuk (ketuk benda, lalu ketuk tujuan) atau papan ketik.
 * Tujuan lepas ditandai dengan atribut data-drop="<id>".
 */
interface DraggableProps {
  id: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onTap: (id: string) => void;
  onDrop: (id: string, targetId: string | null) => void;
  onHover?: (targetId: string | null) => void;
  className?: string;
  children: React.ReactNode;
}

const THRESHOLD = 8;

function findTarget(x: number, y: number): string | null {
  const els = document.elementsFromPoint(x, y);
  for (const el of els) {
    const t = (el as HTMLElement).closest?.('[data-drop]') as HTMLElement | null;
    if (t?.dataset.drop) return t.dataset.drop;
  }
  return null;
}

export const Draggable: React.FC<DraggableProps> = ({
  id,
  label,
  disabled,
  selected,
  onTap,
  onDrop,
  onHover,
  className = '',
  children,
}) => {
  const start = useRef<{ x: number; y: number; pid: number } | null>(null);
  const dragged = useRef(false);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);

  const handleDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, pid: e.pointerId };
    dragged.current = false;
  };

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s || s.pid !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!dragged.current && Math.hypot(dx, dy) < THRESHOLD) return;
    if (!dragged.current) {
      dragged.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* abaikan */
      }
    }
    setOffset({ x: dx, y: dy });
    onHover?.(findTarget(e.clientX, e.clientY));
  };

  const finish = (e: React.PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const s = start.current;
    if (!s || s.pid !== e.pointerId) return;
    start.current = null;
    if (dragged.current) {
      const target = cancelled ? null : findTarget(e.clientX, e.clientY);
      setOffset(null); // benda kembali ke tempatnya (dengan transisi)
      onHover?.(null);
      onDrop(id, target);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    onTap(id);
  };

  const dragging = offset !== null;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={(e) => finish(e)}
      onPointerCancel={(e) => finish(e, true)}
      onClick={handleClick}
      className={`drag-handle relative ${dragging ? 'z-50 cursor-grabbing scale-110 shadow-2xl' : 'cursor-grab transition-transform duration-300'} ${className}`}
      style={{ transform: offset ? `translate(${offset.x}px, ${offset.y}px) scale(1.1)` : undefined }}
    >
      {children}
    </button>
  );
};
