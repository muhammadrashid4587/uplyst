import { useEffect, useState, useRef, useCallback } from "react";

const MAGNETIC_DISTANCE = 80; // pixels - range to start magnetic pull
const MAGNETIC_STRENGTH = 0.35; // 0-1 - how strong the pull is

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const displayPositionRef = useRef({ x: 0, y: 0 });
  const magneticTargetRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>();

  const getClickableElement = useCallback((target: HTMLElement): HTMLElement | null => {
    if (target.tagName === 'BUTTON' || target.tagName === 'A') return target;
    const button = target.closest('button');
    if (button) return button as HTMLElement;
    const link = target.closest('a');
    if (link) return link as HTMLElement;
    const roleButton = target.closest('[role="button"]');
    if (roleButton) return roleButton as HTMLElement;
    if (window.getComputedStyle(target).cursor === 'pointer') return target;
    return null;
  }, []);

  const findNearbyClickable = useCallback((x: number, y: number): { element: HTMLElement; centerX: number; centerY: number } | null => {
    const clickables = document.querySelectorAll('button, a, [role="button"]');
    let closest: { element: HTMLElement; centerX: number; centerY: number; distance: number } | null = null;

    clickables.forEach((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(x - centerX, y - centerY);

      if (distance < MAGNETIC_DISTANCE && (!closest || distance < closest.distance)) {
        closest = { element: el as HTMLElement, centerX, centerY, distance };
      }
    });

    return closest ? { element: closest.element, centerX: closest.centerX, centerY: closest.centerY } : null;
  }, []);

  const updateCursorPosition = useCallback(() => {
    if (!cursorRef.current) return;

    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    let targetX = mouseX;
    let targetY = mouseY;

    // Apply magnetic effect
    const nearby = findNearbyClickable(mouseX, mouseY);
    if (nearby) {
      const distance = Math.hypot(mouseX - nearby.centerX, mouseY - nearby.centerY);
      const pull = Math.max(0, 1 - distance / MAGNETIC_DISTANCE) * MAGNETIC_STRENGTH;
      
      targetX = mouseX + (nearby.centerX - mouseX) * pull;
      targetY = mouseY + (nearby.centerY - mouseY) * pull;
      magneticTargetRef.current = nearby.element;
    } else {
      magneticTargetRef.current = null;
    }

    // Smooth interpolation for display position
    displayPositionRef.current.x += (targetX - displayPositionRef.current.x) * 0.4;
    displayPositionRef.current.y += (targetY - displayPositionRef.current.y) * 0.4;

    cursorRef.current.style.transform = `translate3d(${displayPositionRef.current.x}px, ${displayPositionRef.current.y}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`;
  }, [isClicking, findNearbyClickable]);

  useEffect(() => {
    let animating = true;

    const animate = () => {
      if (!animating) return;
      updateCursorPosition();
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = getClickableElement(target);
      setIsPointer(!!clickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleFirstMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      displayPositionRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      document.removeEventListener('mousemove', handleFirstMove);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleFirstMove);

    return () => {
      animating = false;
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleFirstMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateCursorPosition, getClickableElement]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate3d(${displayPositionRef.current.x}px, ${displayPositionRef.current.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full bg-primary transition-[width,height] duration-100 ${
            isPointer ? 'w-6 h-6' : 'w-5 h-5'
          }`}
          style={{
            boxShadow: '0 0 20px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.4)',
          }}
        />
      </div>

      {/* Global style to hide default cursor */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
