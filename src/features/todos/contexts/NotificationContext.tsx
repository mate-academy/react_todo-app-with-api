import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorType } from '../model/types';

type NotificationMessage = string | ErrorType;

type NotificationContextType = {
  message: string;
  isVisible: boolean;
  bump: boolean;
  showNotification: (msg: NotificationMessage) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const SHOW_TIME = 3000;
const BUMP_TIME = 250;

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [bump, setBump] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (bumpTimerRef.current) {
      clearTimeout(bumpTimerRef.current);
      bumpTimerRef.current = null;
    }
  }, []);

  const showNotification = useCallback(
    (msg: NotificationMessage) => {
      clearTimers();
      setMessage(String(msg));
      setIsVisible(true);

      setBump(true);
      bumpTimerRef.current = setTimeout(() => setBump(false), BUMP_TIME);

      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setMessage('');
        setBump(false);
      }, SHOW_TIME);
    },
    [clearTimers],
  );

  const hideNotification = useCallback(() => {
    clearTimers();
    setIsVisible(false);
    setBump(false);
    setMessage('');
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <NotificationContext.Provider
      value={{ message, isVisible, bump, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = React.useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }

  return ctx;
};
