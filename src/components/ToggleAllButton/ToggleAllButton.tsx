import React, { useContext } from 'react';
import { Todo } from '../../types';
import classNames from 'classnames';
import { TodosDispatchContext } from '../../contexts/TodosContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { todosApi } from '../../api/todos';

type Props = {
  todos: Todo[];
};

export const ToggleAllButton: React.FC<Props> = ({ todos }) => {
  const todosDispatch = useContext(TodosDispatchContext);
  const { setError } = useContext(ErrorContext);

  const uncompletedTodos = todos.filter(({ completed }) => !completed);

  const handleToggleAll = async () => {
    const targetTodos =
      uncompletedTodos.length === 0 ? todos : uncompletedTodos;

    const togglePromises = targetTodos.map(todo => {
      todosDispatch({
        type: 'update',
        payload: { ...todo, loading: true },
      });

      return todosApi.patch({
        id: todo.id,
        completed: !todo.completed,
      });
    });

    const togglePromisesResults = await Promise.allSettled(togglePromises);

    togglePromisesResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        todosDispatch({
          type: 'update',
          payload: { ...result.value, loading: false },
        });
      } else {
        const currentTodo = targetTodos[index];

        todosDispatch({
          type: 'update',
          payload: { ...currentTodo, loading: false },
        });

        setError({ message: 'Unable to update a todo' });
      }
    });
  };

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: uncompletedTodos.length === 0,
      })}
      onClick={handleToggleAll}
      data-cy="ToggleAllButton"
    />
  );
};
