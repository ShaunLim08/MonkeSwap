'use client';
import { useEffect, useState } from 'react';

const FallingBanana = () => {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(true);
  const bananaCount = 15;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  if (!isClient || !show) return null;

  const bananas = Array.from({ length: bananaCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 90 + 5}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 4,
    rotation: Math.random() < 0.5 ? 360 : -360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bananas.map(banana => (
        <>
        <div 
          key={banana.id}
          className="absolute text-6xl z-50"
          style={{
            left: banana.left,
            animation: `fall ${banana.duration}s linear ${banana.delay}s forwards`
          }}
        >
          🍌
        </div>
        <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(${banana.rotation}deg);
          }
        }
      `}</style>
        </>
      ))}
      
    </div>
  );
};

export default FallingBanana;