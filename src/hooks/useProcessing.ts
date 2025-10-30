import { useState } from 'react';

export const useProcessing = () => {
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const addProcessing = (id: number) =>
    setProcessingIds(prev => {
      const n = new Set(prev);

      n.add(id);

      return n;
    });

  const removeProcessing = (id: number) =>
    setProcessingIds(prev => {
      const n = new Set(prev);

      n.delete(id);

      return n;
    });

  const addManyProcessing = (ids: number[]) =>
    setProcessingIds(prev => {
      const n = new Set(prev);

      ids.forEach(id => n.add(id));

      return n;
    });

  return [
    processingIds,
    addProcessing,
    removeProcessing,
    addManyProcessing,
  ] as const;
};
