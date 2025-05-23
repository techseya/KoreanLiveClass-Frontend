import { useEffect, useRef } from 'react';

interface UseIdleTimerOptions {
  timeout: number;
  onIdle: () => void;
  enabled?: boolean;
}

const useIdleTimer = ({ timeout, onIdle, enabled = true }: UseIdleTimerOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserActivity = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    if (!enabled) return;

    handleUserActivity();

    const handleIdleTimeout = () => handleUserActivity();

    window.addEventListener('mousemove', handleIdleTimeout);
    window.addEventListener('keydown', handleIdleTimeout);
    window.addEventListener('mousedown', handleIdleTimeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleIdleTimeout);
      window.removeEventListener('keydown', handleIdleTimeout);
      window.removeEventListener('mousedown', handleIdleTimeout);
    };
  }, [timeout, onIdle, enabled]);
};

export default useIdleTimer;
