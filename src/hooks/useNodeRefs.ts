import React, { useRef } from 'react';

export const useNodeRefs = (): ((
  id: number,
) => React.RefObject<HTMLDivElement>) => {
  const refs = useRef(new Map<number, React.RefObject<HTMLDivElement>>());
  const getRef = (id: number) => {
    if (!refs.current.has(id)) {
      refs.current.set(id, React.createRef());
    }

    return refs.current.get(id)!;
  };

  return getRef;
};
