import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';

import {
  ErrorContext,
  TodosContext,
  UpdatingTodosIdsContext,
} from '../providers/TodosProvider';

import { Todo } from '../types/Todo';
import { updateTodoItem } from '../utils/updateTodoItem';

type Props = {};

export const ToggleAllButton: React.FC<Props> = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const { setUpdatingTodosIds } = useContext(UpdatingTodosIdsContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleUpdateAllTodosCompleted = useCallback(() => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    let updatedTodos: Todo[];

    if (uncompletedTodos.length > 0) {
      updatedTodos = todos.map(todo => {
        if (!todo.completed) {
          return {
            ...todo,
            completed: true,
          };
        }

        return todo;
      });
    } else {
      updatedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));
    }

    const todosToUpdate = updatedTodos.filter(todo => {
      return todo.completed !== todos.find(t => t.id === todo.id)?.completed;
    });

    setUpdatingTodosIds(prevTodosIds => {
      return [...prevTodosIds, ...todosToUpdate.map(todo => todo.id)];
    });

    const updatedTodosPromises = todosToUpdate.map(todo => {
      return updateTodoItem({
        todo,
        setTodos,
        setErrorMessage,
        setUpdatingTodosIds,
      });
    });

    Promise.all(updatedTodosPromises);
  }, [setTodos, todos, setUpdatingTodosIds, setErrorMessage]);

  return (
    // need to update all todos completed status onClick
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isAllCompleted,
      })}
      data-cy="ToggleAllButton"
      aria-label="Toggle all todos"
      onClick={handleUpdateAllTodosCompleted}
    />
  );
};
