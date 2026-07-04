'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) return null;

  const lines = text.split(/\r?\n/);

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => {
        const elements = parseLine(line);
        return (
          <React.Fragment key={lineIndex}>
            {elements}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
}

interface TextPart {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'spoiler' | 'url';
  content: string;
}

function splitByPatterns(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let remaining = text;

  const patterns = [
    { type: 'spoiler' as const, regex: /\|\|(.+?)\|\|/ },
    { type: 'bold' as const, regex: /\*\*(.+?)\*\*/ },
    { type: 'underline' as const, regex: /__(.+?)__/ },
    { type: 'strikethrough' as const, regex: /~~(.+?)~~/ },
    { type: 'italic' as const, regex: /\*(.+?)\*/ },
    { type: 'code' as const, regex: /`(.+?)`/ },
    { type: 'url' as const, regex: /(https?:\/\/[^\s]+)/ },
  ];

  while (remaining.length > 0) {
    let earliestMatch: { type: TextPart['type']; content: string; index: number; length: number } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = {
            type: pattern.type,
            content: match[1] || match[0],
            index: match.index,
            length: match[0].length
          };
        }
      }
    }

    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        parts.push({ type: 'text', content: remaining.substring(0, earliestMatch.index) });
      }
      parts.push({ type: earliestMatch.type, content: earliestMatch.content });
      remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
    } else {
      parts.push({ type: 'text', content: remaining });
      break;
    }
  }

  return parts;
}

function renderPart(part: TextPart, key: number): React.ReactNode {
  if (part.type === 'spoiler') {
    return (
      <span key={key} className="formatted-spoiler">
        <span className="spoiler-content">{part.content}</span>
      </span>
    );
  } else if (part.type === 'bold') {
    return <strong key={key} className="formatted-bold">{part.content}</strong>;
  } else if (part.type === 'italic') {
    return <em key={key} className="formatted-italic">{part.content}</em>;
  } else if (part.type === 'underline') {
    return <u key={key} className="formatted-underline">{part.content}</u>;
  } else if (part.type === 'strikethrough') {
    return <s key={key} className="formatted-strikethrough">{part.content}</s>;
  } else if (part.type === 'code') {
    return <code key={key} className="formatted-code-inline">{part.content}</code>;
  } else if (part.type === 'url') {
    return (
      <a 
        key={key} 
        href={part.content} 
        target="_blank" 
        rel="noopener noreferrer"
        className="formatted-link"
        onClick={(e) => e.stopPropagation()}
      >
        {part.content}
      </a>
    );
  }
  return <span key={key}>{part.content}</span>;
}

function parseLine(line: string): React.ReactNode[] {
  // ตรวจสอบ quote ที่ต้นแถว
  if (line.startsWith('> ')) {
    const inner = parseLine(line.substring(2));
    return [<span key="quote" className="formatted-quote">{inner}</span>];
  }

  const parts = splitByPatterns(line);
  return parts.map((part, idx) => renderPart(part, idx));
}