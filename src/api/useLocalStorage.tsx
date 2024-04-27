import { useState } from 'react';
type ReturnFunction = <T>(v: T) => T;

export function useLocalStorage<T>(
  todos: string,
  startValue: T,
): [T, (v: T | ReturnFunction) => void] {
  const [state, setState] = useState(() => {
    const data = localStorage.getItem(todos);

    if (data === null) {
      return startValue;
    }

    try {
      return JSON.parse(data);
    } catch {
      localStorage.removeItem(todos);

      return startValue;
    }
  });

  const save = (newValue: ReturnFunction) => {
    if (typeof newValue === 'function') {
      const value = newValue(state);
    }

    localStorage.setItem(todos, JSON.stringify(newValue));

    setState(newValue);
  };

  return [state, save];
}

export function useLocalStorageForFilter<T>(
  key: string,
  startValue: T,
): [T, (v: T) => void] {
  const [state, setState] = useState(() => {
    const data = localStorage.getItem(key);

    if (data === null) {
      return startValue;
    }

    try {
      return JSON.parse(data);
    } catch {
      localStorage.removeItem(key);

      return startValue;
    }
  });

  const save = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));

    setState(newValue);
  };

  return [state, save];
}
