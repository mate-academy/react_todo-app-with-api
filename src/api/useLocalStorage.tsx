import { useState } from 'react';
type ReturnFunction<T> = (v: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(
  todos: string,
  startValue: T,
): [T, ReturnFunction<T>] {
  const [state, setState] = useState<T>(() => {
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

  const save: ReturnFunction<T> = newValue => {
    setState(prevState => {
      const updatedValue: T =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prevState)
          : newValue;

      localStorage.setItem(todos, JSON.stringify(updatedValue));

      return updatedValue;
    });
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
