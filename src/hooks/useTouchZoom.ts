import { useState, useEffect, useRef, TouchEvent } from 'react';

interface TouchZoomState {
  scale: number;
  posX: number;
  posY: number;
}

interface UseTouchZoomOptions {
  minScale?: number;
  maxScale?: number;
  onZoomChange?: (scale: number) => void;
}

export function useTouchZoom(options: UseTouchZoomOptions = {}) {
  const {
    minScale = 1,
    maxScale = 4,
    onZoomChange
  } = options;

  const [state, setState] = useState<TouchZoomState>({
    scale: 1,
    posX: 0,
    posY: 0
  });

  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPinching = useRef<boolean>(false);
  const lastTapTime = useRef<number>(0);

  function getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      isPinching.current = true;
      lastTouchDistance.current = getTouchDistance(e.touches[0], e.touches[1]);
      lastTouchCenter.current = getTouchCenter(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1) {
      const currentTime = Date.now();
      const tapGap = currentTime - lastTapTime.current;

      if (tapGap < 300 && tapGap > 0) {
        handleDoubleTap(e.touches[0]);
      }

      lastTapTime.current = currentTime;
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault();

      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);

      const scaleChange = currentDistance / lastTouchDistance.current;
      let newScale = state.scale * scaleChange;
      newScale = Math.min(Math.max(newScale, minScale), maxScale);

      const deltaX = currentCenter.x - lastTouchCenter.current.x;
      const deltaY = currentCenter.y - lastTouchCenter.current.y;

      setState(prev => ({
        scale: newScale,
        posX: prev.posX + deltaX,
        posY: prev.posY + deltaY
      }));

      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;

      if (onZoomChange) {
        onZoomChange(newScale);
      }
    } else if (e.touches.length === 1 && state.scale > 1) {
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchCenter.current.x;
      const deltaY = touch.clientY - lastTouchCenter.current.y;

      setState(prev => ({
        ...prev,
        posX: prev.posX + deltaX,
        posY: prev.posY + deltaY
      }));

      lastTouchCenter.current = { x: touch.clientX, y: touch.clientY };
    }
  }

  function handleTouchEnd() {
    isPinching.current = false;
  }

  function handleDoubleTap(touch: Touch) {
    if (state.scale > 1) {
      resetZoom();
    } else {
      setState({
        scale: 2,
        posX: 0,
        posY: 0
      });
      if (onZoomChange) {
        onZoomChange(2);
      }
    }
  }

  function resetZoom() {
    setState({
      scale: 1,
      posX: 0,
      posY: 0
    });
    if (onZoomChange) {
      onZoomChange(1);
    }
  }

  function setZoom(scale: number) {
    const clampedScale = Math.min(Math.max(scale, minScale), maxScale);
    setState(prev => ({
      ...prev,
      scale: clampedScale
    }));
    if (onZoomChange) {
      onZoomChange(clampedScale);
    }
  }

  return {
    scale: state.scale,
    posX: state.posX,
    posY: state.posY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetZoom,
    setZoom
  };
}
