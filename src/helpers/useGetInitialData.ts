import { useEffect } from 'react';
import { getTodos } from '../api/todos';
import { TodoFromServer } from '../types/state';

type GetInitialData = {
  onSuccess: (response: TodoFromServer[]) => void;
  onError: () => void;
};

export const useGetInitialData = ({ onSuccess, onError }: GetInitialData) => {
  useEffect(() => {
    getTodos().then(onSuccess).catch(onError);
  }, []);
};
