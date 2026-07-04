'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';

interface TextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  value: string;
}

interface ToolbarState {
  visible: boolean;
  x: number;
  y: number;
}

export default function TextToolbar({ textareaRef, onChange, value }: TextToolbarProps) {
  const [toolbar, setToolbar] = useState<ToolbarState>({ visible: false, x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<{ start: number; end: number; text: string } | null>(null);
  const instanceId = useId();

  const getSelectionInfo = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return null;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value.substring(start, end);
    return { start, end, text };
  }, [textareaRef]);

  const wrapText = useCallback((before: string, after: string) => {
    const info = lastSelectionRef.current;
    if (!info || !info.text) {
      setToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const { start, end, text } = info;
    const newValue = value.substring(0, start) + before + text + after + value.substring(end);
    onChange(newValue);

    // Restore focus and cursor position after React re-render
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const newCursorPos = start + before.length + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    setToolbar(prev => ({ ...prev, visible: false }));
    lastSelectionRef.current = null;
  }, [value, onChange, textareaRef]);

  const hideText = useCallback(() => {
    const info = lastSelectionRef.current;
    if (!info || !info.text) {
      setToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const { start, end, text } = info;
    const newValue = value.substring(0, start) + '||' + text + '||' + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const newCursorPos = start + 2 + text.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    setToolbar(prev => ({ ...prev, visible: false }));
    lastSelectionRef.current = null;
  }, [value, onChange, textareaRef]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // ใช้ instanceId ใน data attribute เพื่อแยกแต่ละ instance
    textarea.setAttribute('data-texttoolbar-id', instanceId);

    const handleMouseUp = (e: MouseEvent) => {
      // ตรวจสอบว่า event มาจาก textarea ของ instance นี้หรือไม่
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-texttoolbar-id="${instanceId}"]`)) return;

      setTimeout(() => {
        const info = getSelectionInfo();
        if (info && info.text.length > 0) {
          lastSelectionRef.current = info;

          const toolbarWidth = 280;
          const toolbarHeight = 44;

          let x = e.clientX - toolbarWidth / 2;
          let y = e.clientY - toolbarHeight - 12;

          if (x < 10) x = 10;
          if (x + toolbarWidth > window.innerWidth - 10) x = window.innerWidth - toolbarWidth - 10;
          if (y < 10) y = e.clientY + 20;

          setToolbar({ visible: true, x, y });
        } else {
          setToolbar(prev => ({ ...prev, visible: false }));
          lastSelectionRef.current = null;
        }
      }, 10);
    };

    const handleKeyDown = () => {
      setToolbar(prev => ({ ...prev, visible: false }));
      lastSelectionRef.current = null;
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const info = getSelectionInfo();
        if (!info || info.text.length === 0) {
          setToolbar(prev => ({ ...prev, visible: false }));
          lastSelectionRef.current = null;
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [textareaRef, getSelectionInfo, instanceId]);

  if (!toolbar.visible) return null;

  const tools = [
    { icon: 'fas fa-bold', title: 'Bold', action: () => wrapText('**', '**'), key: 'bold' },
    { icon: 'fas fa-italic', title: 'Italic', action: () => wrapText('*', '*'), key: 'italic' },
    { icon: 'fas fa-underline', title: 'Underline', action: () => wrapText('__', '__'), key: 'underline' },
    { icon: 'fas fa-strikethrough', title: 'Strikethrough', action: () => wrapText('~~', '~~'), key: 'strikethrough' },
    { icon: 'fas fa-quote-right', title: 'Quote', action: () => wrapText('> ', ''), key: 'quote' },
    { icon: 'fas fa-code', title: 'Code', action: () => wrapText('`', '`'), key: 'code' },
    { icon: 'fas fa-eye-slash', title: 'Spoiler', action: hideText, key: 'spoiler' },
  ];

  return (
    <div 
      ref={toolbarRef}
      className="text-toolbar"
      style={{ 
        position: 'fixed', 
        left: toolbar.x, 
        top: toolbar.y,
        zIndex: 9999 
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.key}
          type="button"
          className="text-toolbar-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            tool.action();
          }}
          title={tool.title}
        >
          <i className={tool.icon}></i>
        </button>
      ))}
    </div>
  );
}
