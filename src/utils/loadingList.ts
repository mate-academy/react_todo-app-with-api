import { Todo } from '../types/Todo';

export const loadingList = (list: Todo[]) => {
  return [...list].map(({ id }) => {
    return { id, isLoading: false };
  });
};
