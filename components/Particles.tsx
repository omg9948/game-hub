'use client';

import { useEffect } from 'react';

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      particle.style.opacity = (Math.random() * 0.5 + 0.2).toString();
      container.appendChild(particle);
    }
  }, []);

  return <div className="particles" id="particles" />;
}
