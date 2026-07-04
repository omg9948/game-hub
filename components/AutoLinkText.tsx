'use client';

import React from 'react';

interface AutoLinkTextProps {
  text: string;
  className?: string;
}

export default function AutoLinkText({ text, className = '' }: AutoLinkTextProps) {
  if (!text) return null;

  // แยกบรรทัด
  const lines = text.split(/\r?\n/);

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => {
        // ตรวจหาลิงก์ในข้อความแต่ละบรรทัด
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);

        return (
          <React.Fragment key={lineIndex}>
            {parts.map((part, partIndex) => {
              // ตรวจสอบว่าส่วนนี้เป็น URL หรือไม่
              if (part.match(/^https?:\/\/[^\s]+$/)) {
                return (
                  <a
                    key={partIndex}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="auto-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part}
                  </a>
                );
              }
              // ถ้าไม่ใช่ URL → แสดงเป็นข้อความธรรมดา
              return <span key={partIndex}>{part}</span>;
            })}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
}
