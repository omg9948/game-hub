'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

// แปลง markdown-style syntax เป็น React elements ที่ render จริง
export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) return null;

  const lines = text.split(/\r?\n/);

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => {
        // แยกส่วนต่างๆ ในบรรทัด
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

function parseLine(line: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = line;
  let keyIndex = 0;

  // ตรวจสอบ quote ที่ต้นแถว
  if (remaining.startsWith('> ')) {
    return [
      <span key="quote" className="formatted-quote">
        {parseInlineFormatting(remaining.substring(2), keyIndex)}
      </span>
    ];
  }

  // แยก inline formatting
  const parts = splitByPatterns(remaining);

  for (const part of parts) {
    if (part.type === 'spoiler') {
      result.push(
        <span key={keyIndex++} className="formatted-spoiler">
          <span className="spoiler-content">{parseInlineFormatting(part.content, keyIndex++)}</span>
        </span>
      );
    } else if (part.type === 'bold') {
      result.push(
        <strong key={keyIndex++} className="formatted-bold">
          {parseInlineFormatting(part.content, keyIndex++)}
        </strong>
      );
    } else if (part.type === 'italic') {
      result.push(
        <em key={keyIndex++} className="formatted-italic">
          {parseInlineFormatting(part.content, keyIndex++)}
        </em>
      );
    } else if (part.type === 'underline') {
      result.push(
        <u key={keyIndex++} className="formatted-underline">
          {parseInlineFormatting(part.content, keyIndex++)}
        </u>
      );
    } else if (part.type === 'strikethrough') {
      result.push(
        <s key={keyIndex++} className="formatted-strikethrough">
          {parseInlineFormatting(part.content, keyIndex++)}
        </s>
      );
    } else if (part.type === 'code') {
      result.push(
        <code key={keyIndex++} className="formatted-code-inline">
          {part.content}
        </code>
      );
    } else if (part.type === 'url') {
      result.push(
        <a 
          key={keyIndex++} 
          href={part.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="formatted-link"
          onClick={(e) => e.stopPropagation()}
        >
          {part.content}
        </a>
      );
    } else {
      result.push(<span key={keyIndex++}>{part.content}</span>);
    }
  }

  return result;
}

interface TextPart {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'spoiler' | 'url';
  content: string;
}

function splitByPatterns(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let remaining = text;

  // ลำดับความสำคัญ: spoiler > bold > italic > underline > strikethrough > code > url
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
      // เพิ่ม text ก่อน match
      if (earliestMatch.index > 0) {
        parts.push({ type: 'text', content: remaining.substring(0, earliestMatch.index) });
      }
      parts.push({ type: earliestMatch.type, content: earliestMatch.content });
      remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
    } else {
      // ไม่มี match เหลือ
      parts.push({ type: 'text', content: remaining });
      break;
    }
  }

  return parts;
}

function parseInlineFormatting(text: string, startKey: number): React.ReactNode[] {
  const parts = splitByPatterns(text);
  const result: React.ReactNode[] = [];
  let keyIndex = startKey;

  for (const part of parts) {
    if (part.type === 'spoiler') {
      result.push(
        <span key={keyIndex++} className="formatted-spoiler">
          <span className="spoiler-content">{part.content}</span>
        </span>
      );
    } else if (part.type === 'bold') {
      result.push(<strong key={keyIndex++} className="formatted-bold">{part.content}</strong>);
    } else if (part.type === 'italic') {
      result.push(<em key={keyIndex++} className="formatted-italic">{part.content}</em>);
    } else if (part.type === 'underline') {
      result.push(<u key={keyIndex++} className="formatted-underline">{part.content}</u>);
    } else if (part.type === 'strikethrough') {
      result.push(<s key={keyIndex++} className="formatted-strikethrough">{part.content}</s>);
    } else if (part.type === 'code') {
      result.push(<code key={keyIndex++} className="formatted-code-inline">{part.content}</code>);
    } else if (part.type === 'url') {
      result.push(
        <a 
          key={keyIndex++} 
          href={part.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="formatted-link"
          onClick={(e) => e.stopPropagation()}
        >
          {part.content}
        </a>
      );
    } else {
      result.push(<span key={keyIndex++}>{part.content}</span>);
    }
  }

  return result;
}
