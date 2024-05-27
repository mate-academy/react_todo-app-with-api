import { RefObject, useEffect } from 'react';

type UseClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
) => void;

export const useClickOutside: UseClickOutside = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};
