import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  duration = 1500,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;
    let frame = 0;
    const totalFrames = 60;
    const increment = target / totalFrames;
    const timer = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount((prev) => prev + increment);
      }
    }, duration / totalFrames);
    return () => clearInterval(timer);
  }, [isIntersecting, target, duration]);

  const format = (v: number) =>
    Math.floor(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return <span ref={elementRef}>{format(count)}{suffix}</span>;
};
