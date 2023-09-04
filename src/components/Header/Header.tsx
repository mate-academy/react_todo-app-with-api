import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { patchTodo } from '../../api/todos';
import { NewTodoForm } from '../NewTodoForm';
import { AppContext } from '../AppContext';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    activeTodos,
    completedTodosIds,
    showError,
    setErrorMessage,
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(AppContext);

  const hasOnlyCompletedTodos = useMemo(() => (
    todos.length === completedTodosIds.length
  ), [todos]);

  const toggleTodos = useCallback(async (shouldToggleAll: boolean) => {
    try {
      setErrorMessage('');

      const todosToToggle = shouldToggleAll
        ? todos
        : activeTodos;

      setLoadingTodosIds(prevIds => [
        ...prevIds,
        ...todosToToggle.map(({ id }) => id),
      ]);

      await Promise.all(todosToToggle.map(({ id, completed }) => (
        patchTodo(id, { completed: !completed })
      )));

      setTodos(prevTodos => prevTodos.map(prevTodo => {
        if (todosToToggle.includes(prevTodo)) {
          return {
            ...prevTodo,
            completed: !prevTodo.completed,
          };
        }

        return prevTodo;
      }));
    } catch {
      showError('Unable to toggle all todos');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, [loadingTodosIds, todos]);

  const handleToggleTodosButtonClick = () => {
    toggleTodos(hasOnlyCompletedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="Toggle"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: hasOnlyCompletedTodos },
          )}
          onClick={handleToggleTodosButtonClick}
        />
      )}

      <NewTodoForm />
    </header>
  );
};
