/* eslint-disable max-len */
import { useState } from 'react';

export const useTodoChange = (): [
  number | number[],
  boolean,
  ((changingTodosId: number | number[], state: boolean) => void)] => {
  const [selectedTodoIds, setSelectedTodoIds] = useState<number | number[]>(-1);
  const [changingState, setChangingState] = useState(false);

  const setTodoChange = (changingTodoIds: number | number[], state: boolean) => {
    setChangingState(state);
    setSelectedTodoIds(changingTodoIds);
  };

  return [selectedTodoIds, changingState, setTodoChange];
};
