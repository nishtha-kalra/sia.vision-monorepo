import React from 'react';

const CircularText: React.FC<{ className?: string; text: string }> = ({ className, text }) => {
  return (
    <div className={`h-[173px] w-[173px] relative ${className || ''}`}>
      {text.split('').map((char, index) => {
        const angle = -149.744 + index * 12;
        const style = {
          transform: `rotate(${angle}deg)`,
          position: 'absolute' as const,
          fontSize: '1.5rem',
          color: '#27272a',
          left: '50%',
          top: '50%',
          transformOrigin: 'center 86.5px',
        };
        return (
          <div
            key={index}
            className="text-2xl text-zinc-800"
            style={style}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};

export default CircularText; 