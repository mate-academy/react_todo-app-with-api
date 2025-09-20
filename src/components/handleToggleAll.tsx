import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';
import React from 'react';

type Props = {
  todos: Todo[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const handleToggleAll = ({
  todos,
  setProcessingIds,
  setTodos,
  setError,
  setErrorType,
}: Props) => {
  const allCompleted = todos.every(todo => todo.completed);
  const newCompletedStatus = !allCompleted;

  const todosUpdate = todos.filter(
    todo => todo.completed !== newCompletedStatus,
  );

  if (todosUpdate.length === 0) {
    return;
  }

  setProcessingIds(todosUpdate.map(todo => todo.id));

  Promise.allSettled(
    todosUpdate.map(todo =>
      fetchClient.patch(`/todos/${todo.id}`, {
        completed: newCompletedStatus,
      }),
    ),
  )
    .then(results => {
      const updatedTodos = todos.map(todo => {
        const index = todosUpdate.findIndex(t => t.id === todo.id);

        if (index === -1) {
          return todo;
        }

        return results[index].status === 'fulfilled'
          ? { ...todo, completed: newCompletedStatus }
          : todo;
      });

      setTodos(updatedTodos);
    })
    .catch(() => {
      setError(true);
      setErrorType('update');
    })
    .finally(() => {
      setProcessingIds([]);
    });
};
