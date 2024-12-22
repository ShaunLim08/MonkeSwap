'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const TokenAvalanche = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const dropIntervalRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!sceneRef.current || !mounted) return;

    const { Engine, Render, Runner, Composite, Common, MouseConstraint, Mouse, Bodies } = Matter;

    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'transparent'
      }
    });

    const tokenImages = ['/next.png', '/jupiter.png', '/solana.png', '/tailwind.png'];

    const createToken = () => {
      const randomIndex = Math.floor(Math.random() * tokenImages.length);
      return Bodies.circle(Common.random(100, 700), -30, 30, {
        friction: 0.00001,
        restitution: 0.5,
        density: 0.001,
        render: {
          sprite: {
            texture: tokenImages[randomIndex],
            xScale: 1,
            yScale: 1
          }
        }
      });
    };

    // Add static bodies for walls and platforms
    Composite.add(world, [
      Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: -Math.PI * 0.06, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(340, 580, 700, 20, { isStatic: true, angle: Math.PI * 0.04, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(-10, 300, 60, 600, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(810, 300, 60, 600, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: '#060a19' } })
    ]);

    // Handle cleaning up bodies that fall below the scene
    Matter.Events.on(engine, 'afterUpdate', () => {
      const bodies = Composite.allBodies(world);
      const bodiesToRemove = [];
      
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.position.y > 800 && !body.isStatic) {
          bodiesToRemove.push(body);
        }
      }
      
      for (let i = 0; i < bodiesToRemove.length; i++) {
        Composite.remove(world, bodiesToRemove[i]);
      }
    });

    // Add new tokens periodically
    dropIntervalRef.current = setInterval(() => {
      if (Composite.allBodies(world).length < 100) {
        Composite.add(world, createToken());
      }
    }, 500);

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Start the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup function
    return () => {
      // Stop the engine and runner
      Runner.stop(runner);
      Render.stop(render);
      
      // Clear all events
      Matter.Events.off(engine);
      
      // Clear the engine
      Engine.clear(engine);
      
      // Clear the interval
      clearInterval(dropIntervalRef.current);
      
      // Remove the canvas if it exists
      if (render.canvas) {
        render.canvas.remove();
      }
      
      // Clear references
      engineRef.current = null;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[800px] h-[600px] bg-transparent overflow-hidden">
        <div className="bg-transparent" ref={sceneRef} />
      </div>
    </div>
  );
};

export default TokenAvalanche;