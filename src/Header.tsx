/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoContext';
import { ErrorMessage } from './types/Error';
import { USER_ID } from './ultis/userId';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const {
    addCurrentTodo,
    setErrorMessage,
    isLoading,
    setIsLoading,
    todos,
    updateCurrentTodo,
  } = useContext(TodosContext);

  const titleFocus = useRef<HTMLInputElement>(null);
  const isEveryCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  useEffect(() => {
    if (titleFocus.current && !isLoading) {
      titleFocus.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessage.None);

    if (!newTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsLoading(true);

    addCurrentTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(() => setNewTitle(''))
      .catch(() => setIsLoading(false))
      .finally(() => setIsLoading(false));
  };

  const toggleAllTodos = useCallback(() => {
    const togglePromises = todos.map(todo => updateCurrentTodo(
      { ...todo, completed: !isEveryCompleted },
    ));

    Promise.all(togglePromises);
  }, [todos, updateCurrentTodo, isEveryCompleted]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: !isEveryCompleted })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          ref={titleFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
