import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { patchTodo } from '../../api/todos';
import { TodoForm } from '../TodoForm/Todoform';
import { AppContext } from '../AppContext/AppContext';

export const Header: React.FC = () => {
  const {
    allTodos,
    setAllTodos,
    activeTodos,
    completedTodosIds,
    showError,
    setShouldShowError,
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

      await Promise.all(todosToToggle.map(({ id: toggleId, completed }) => (
        patchTodo(toggleId, { completed: !completed })
      )));

      setAllTodos(prevTodos => prevTodos.map(prevTodo => {
        if (todosToToggle.some(({ id }) => id === prevTodo.id)) {
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
      setLoadingTodosIds([]);
    }
  }, [allTodos, activeTodos]);

  const handleToggleTodosButtonClick = () => {
    toggleTodos(hasOnlyCompletedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Toggle"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: hasOnlyCompletedTodos },
        )}
        onClick={handleToggleTodosButtonClick}
      />

      <TodoForm />
    </header>
  );
};
