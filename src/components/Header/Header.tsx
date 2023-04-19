import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { patchTodo } from '../../api/todos';
import { NewTodoForm } from '../NewTodoForm';
import { AppContext } from '../AppContext';

export const Header: React.FC = () => {
  const {
    allTodos,
    setAllTodos,
    activeTodos,
    completedTodosIds,
    showError,
    setShouldShowError,
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(AppContext);

  const hasOnlyCompletedTodos = useMemo(() => (
    allTodos.length === completedTodosIds.length
  ), [allTodos]);

  const toggleTodos = useCallback(async (shouldToggleAll: boolean) => {
    try {
      setShouldShowError(false);

      const todosToToggle = shouldToggleAll
        ? allTodos
        : activeTodos;

      setLoadingTodosIds(prevIds => [
        ...prevIds,
        ...todosToToggle.map(({ id }) => id),
      ]);

      await Promise.all(todosToToggle.map(({ id, completed }) => (
        patchTodo(id, { completed: !completed })
      )));

      setAllTodos(prevTodos => prevTodos.map(prevTodo => {
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
  }, [loadingTodosIds, allTodos]);

  const handleToggleTodosButtonClick = () => {
    toggleTodos(hasOnlyCompletedTodos);
  };

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
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
