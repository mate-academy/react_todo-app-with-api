import { Dispatch, SetStateAction } from 'react';

import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

import { updateTodo } from '../api/todos';
import { handleError } from './handleError';

export const handleUpdateTodos = (
  idsForUpdate: number[],
  newData: Partial<Todo>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setIdsForUpdate: Dispatch<SetStateAction<number[]>>,
  setError: Dispatch<SetStateAction<Errors>>,
) => {
  Promise.allSettled(
    idsForUpdate.map(id =>
      updateTodo(id, newData)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id !== updatedTodo.id ? todo : updatedTodo,
            ),
          );
        })
        .catch(() => {
          handleError(Errors.UPDATE_TODO, setError);
        }),
    ),
  ).finally(() => {
    setIdsForUpdate([]);
  });
};
