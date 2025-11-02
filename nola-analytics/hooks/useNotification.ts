import { useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  message: string;
  type?: NotificationType;
  duration?: number;
}

/**
 * Hook for displaying notifications
 * Currently uses native alerts, but can be easily replaced with a toast library
 */
export function useNotification() {
  const notify = useCallback(({ message, type = 'info' }: NotificationOptions) => {
    // For now, using native alert
    // TODO: Replace with proper toast notification library (e.g., react-hot-toast, sonner)
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ';
    alert(prefix + message);
  }, []);

  return { notify };
}
