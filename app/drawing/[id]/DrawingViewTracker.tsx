'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

interface DrawingViewTrackerProps {
  drawingId: string;
  drawingName: string;
  playerCount: number;
  prizeCount: number;
}

export default function DrawingViewTracker({ 
  drawingId, 
  drawingName, 
  playerCount, 
  prizeCount 
}: DrawingViewTrackerProps) {
  useEffect(() => {
    track('Drawing Viewed', {
      drawingId,
      drawingName,
      playerCount,
      prizeCount,
    });
  }, [drawingId, drawingName, playerCount, prizeCount]);

  return null;
}
