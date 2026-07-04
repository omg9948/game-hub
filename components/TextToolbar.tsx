'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

interface TextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

interface ToolbarState {
  visible: boolean;
  x: number;
  y: number;
}

export default function TextToolbar({ textareaRef }: TextToolbarProps) {
  const { t } = useLanguage();
  const [toolbar, setToolbar] = useState<ToolbarState>({ visible: false, x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const getSelectedText = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { text: '', start: 0, end: 0 };
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return { text: textarea.value.substring(start, end), start, end };
  }, [textareaRef]);

  const wrapText = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { text, start, end } = getSelectedText();
    if (!text) {
      setToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const newValue = textarea.value.substring(0, start) + before + text + after + textarea.value.substring(end);
    textarea.value = newValue;

    // Dispatch input event to trigger onChange
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    // Restore focus and selection
    textarea.focus();
    const newCursorPos = start + before.length + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    setToolbar(prev => ({ ...prev, visible: false }));
  }, [textareaRef, getSelectedText]);

  const hideText = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { text, start, end } = getSelectedText();
    if (!text) {
      setToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const newValue = textarea.value.substring(0, start) + '||' + text + '||' + textarea.value.substring(end);
    textarea.value = newValue;

    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    textarea.focus();
    const newCursorPos = start + 2 + text.length + 2;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    setToolbar(prev => ({ ...prev, visible: false }));
  }, [textareaRef, getSelectedText]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleMouseUp = (e: MouseEvent) => {
      // Small delay to let selection update
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString() || '';

        if (selectedText.length > 0 && textarea.contains(e.target as Node)) {
          const rect = textarea.getBoundingClientRect();
          const toolbarWidth = 280;
          const toolbarHeight = 40;

          let x = e.clientX - toolbarWidth / 2;
          let y = e.clientY - toolbarHeight - 10;

          // Keep within viewport
          if (x < 10) x = 10;
          if (x + toolbarWidth > window.innerWidth - 10) x = window.innerWidth - toolbarWidth - 10;
          if (y < 10) y = e.clientY + 20;

          setToolbar({ visible: true, x, y });
        } else {
          setToolbar(prev => ({ ...prev, visible: false }));
        }
      }, 10);
    };

    const handleKeyDown = () => {
      setToolbar(prev => ({ ...prev, visible: false }));
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          setToolbar(prev => ({ ...prev, visible: false }));
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
  }, [textareaRef]);

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
          onClick={(e) => {
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
