import { useState, useEffect, useRef } from 'react';

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
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | undefined>(undefined);
  const iterationRef = useRef(0);
  const hasScrambledRef = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);

  // Special characters for scrambling
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

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
        setDisplayText(text);
        if (frameRef.current) {
          clearTimeout(frameRef.current);
          frameRef.current = undefined;
        }
        return;
      }

      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterationRef.current) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('')
      );
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
    setDisplayText(text);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        clearTimeout(frameRef.current);
      }
    };
  }, []);

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
      }}
    >
      {displayText}
      {children}
    </span>
  );
};

export default ScrambleHover;
