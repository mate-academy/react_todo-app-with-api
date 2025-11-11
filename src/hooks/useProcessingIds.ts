import { useState, useMemo } from 'react';

export type UseProcessingReturn = {
  processingIds: Set<number>;
  addProcessing: (id: number) => void;
  removeProcessing: (id: number) => void;
  addManyProcessing: (ids: number[]) => void;
  isProcessing: (id: number) => boolean;
};

export const useProcessingIds = (): UseProcessingReturn => {
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const startProcessing = (id: number) =>
    setProcessingIds(prev => {
      const newSet = new Set(prev);

      newSet.add(id);

      return newSet;
    });

  const removeProcessing = (id: number) =>
    setProcessingIds(prev => {
      const newSet = new Set(prev);

      newSet.delete(id);

      return newSet;
    });

  const addManyProcessing = (ids: number[]) =>
    setProcessingIds(prev => {
      if (ids.length === 0) {
        return prev;
      }

      const newSet = new Set(prev);

      ids.forEach(id => newSet.add(id));

      return newSet;
    });

  const isProcessing = useMemo(
    () => (id: number) => {
      return processingIds.has(id);
    },
    [processingIds],
  );

  return {
    processingIds,
    addProcessing: startProcessing,
    removeProcessing,
    addManyProcessing,
    isProcessing,
  };
};
