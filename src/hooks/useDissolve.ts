import { useEffect, useRef, useState } from 'react';

/**
 * Keeps a component mounted briefly after `isOpen` turns false so the
 * dissolve-out animation can play before unmounting.
 */
export function useDissolve(isOpen: boolean, duration = 220) {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (timer.current) clearTimeout(timer.current);
      setClosing(false);
      setVisible(true);
      return;
    }
    setVisible((wasVisible) => {
      if (!wasVisible) return wasVisible;
      setClosing(true);
      timer.current = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, duration);
      return wasVisible;
    });
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isOpen, duration]);

  return { visible, closing };
}
