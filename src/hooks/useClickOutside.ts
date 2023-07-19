import { useEffect, useRef, MutableRefObject } from 'react';

export const useClickOutsideComponent = <T extends HTMLElement>(
  setToggleValue: (value: boolean) => void,
): MutableRefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;

      if (
        ref.current
        && !ref.current.contains(clickedElement)
      ) {
        setToggleValue(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [setToggleValue]);

  return ref;
};
