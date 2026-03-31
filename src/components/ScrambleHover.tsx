import { useState, useEffect, useRef } from 'react';

interface CharDisplay {
  char: string;
  isPattern: boolean;
  patternType?: string;
  color?: string;
}

interface ScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  className?: string;
  children?: React.ReactNode;
}

const ScrambleHover = ({
  text,
  scrambleSpeed = 50,
  maxIterations = 8,
  className = '',
  children,
}: ScrambleHoverProps) => {
  const [displayChars, setDisplayChars] = useState<CharDisplay[]>(
    text.split('').map(char => ({ char, isPattern: false }))
  );
  const frameRef = useRef<number | undefined>(undefined);
  const iterationRef = useRef(0);
  const hasScrambledRef = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);

  // Special characters for scrambling
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  
  // Pattern types and colors
  const patternTypes = ['checkerboard', 'stripes', 'dots', 'circles', 'crosshatch'];
  const colors = ['#00FFFF', '#FF00FF', '#FF1493', '#00FF00', '#FFD700', '#FF69B4', '#7B68EE', '#FF4500'];

  useEffect(() => {
    // Calculate and fix the width on mount
    if (spanRef.current && fixedWidth === null) {
      const width = spanRef.current.offsetWidth;
      setFixedWidth(width);
    }
  }, [fixedWidth]);

  const handleMouseEnter = () => {
    if (hasScrambledRef.current) return;
    
    hasScrambledRef.current = true;
    iterationRef.current = 0;
    
    const scramble = () => {
      if (iterationRef.current >= maxIterations) {
        setDisplayChars(text.split('').map(char => ({ char, isPattern: false })));
        if (frameRef.current) {
          clearTimeout(frameRef.current);
          frameRef.current = undefined;
        }
        return;
      }

      const newChars: CharDisplay[] = text.split('').map((char, index) => {
        // Reveal characters progressively
        if (index < iterationRef.current) {
          return { char: text[index], isPattern: false };
        }
        
        if (char === ' ') {
          return { char: ' ', isPattern: false };
        }
        
        // 40% chance to show a pattern rectangle instead of scrambled text
        if (Math.random() < 0.4) {
          const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return {
            char: '',
            isPattern: true,
            patternType,
            color,
          };
        }
        
        // Otherwise show scrambled character
        return {
          char: scrambleChars[Math.floor(Math.random() * scrambleChars.length)],
          isPattern: false,
        };
      });

      setDisplayChars(newChars);
      iterationRef.current += 1;
      frameRef.current = window.setTimeout(scramble, scrambleSpeed);
    };

    scramble();
  };

  const handleMouseLeave = () => {
    hasScrambledRef.current = false;
    iterationRef.current = 0;
    if (frameRef.current) {
      clearTimeout(frameRef.current);
      frameRef.current = undefined;
    }
    setDisplayChars(text.split('').map(char => ({ char, isPattern: false })));
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        clearTimeout(frameRef.current);
      }
    };
  }, []);

  const getPatternStyle = (patternType: string, color: string) => {
    let backgroundImage = '';
    
    switch (patternType) {
      case 'checkerboard':
        backgroundImage = `
          repeating-conic-gradient(${color} 0% 25%, #a0a0a0 0% 50%) 
          50% / 8px 8px
        `;
        break;
      case 'stripes':
        backgroundImage = `
          repeating-linear-gradient(
            90deg,
            ${color} 0px,
            ${color} 3px,
            #a0a0a0 3px,
            #a0a0a0 6px
          )
        `;
        break;
      case 'dots':
        backgroundImage = `
          radial-gradient(circle, ${color} 1.5px, #a0a0a0 1.5px)
        `;
        break;
      case 'circles':
        backgroundImage = `
          repeating-radial-gradient(
            circle at center,
            ${color} 0px,
            ${color} 1.5px,
            #a0a0a0 1.5px,
            #a0a0a0 5px
          )
        `;
        break;
      case 'crosshatch':
        backgroundImage = `
          repeating-linear-gradient(
            45deg,
            ${color} 0px,
            ${color} 1.5px,
            #a0a0a0 1.5px,
            #a0a0a0 5px
          ),
          repeating-linear-gradient(
            -45deg,
            ${color} 0px,
            ${color} 1.5px,
            #a0a0a0 1.5px,
            #a0a0a0 5px
          )
        `;
        break;
    }

    return {
      display: 'inline-block' as const,
      width: '60px',
      height: '0.6em',
      backgroundColor: '#a0a0a0',
      backgroundImage,
      backgroundSize: patternType === 'dots' ? '6px 6px' : undefined,
      verticalAlign: 'middle',
      margin: '0 2px',
    };
  };

  return (
    <span
      ref={spanRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        display: 'inline-block',
        width: fixedWidth ? `${fixedWidth}px` : 'auto',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {displayChars.map((item, index) => {
        if (item.isPattern && item.patternType && item.color) {
          return (
            <span
              key={index}
              style={getPatternStyle(item.patternType, item.color)}
            />
          );
        }
        return <span key={index}>{item.char}</span>;
      })}
      {children}
    </span>
  );
};

export default ScrambleHover;
