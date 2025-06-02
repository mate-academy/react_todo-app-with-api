import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../App';
type Props = {
  todos: Todo[];
  setTodos: (value: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  completedTodos: number;
  setCurrentError: (error: '' | ErrorType) => void;
  onTodoAdd: (todo: Todo) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  shouldFocusInput?: boolean;
};
export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  setCurrentError,
  onTodoAdd,
  onUpdate,
  shouldFocusInput = false,
  setTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, []);
  useEffect(() => {
    if (shouldFocus || shouldFocusInput) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, shouldFocusInput]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setCurrentError(ErrorType.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    setIsLoading(true);
    setCurrentError('');
    try {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      await onTodoAdd(newTodo as Todo);
      setTitle('');
    } catch (error) {
      setCurrentError(ErrorType.UnableToAddTodo);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setShouldFocus(true), 0);
  };

  async function handleCompleteAllTodos() {
    const allCompleted = todos.length === completedTodos;

    try {
      setIsLoading(true);

      const todosToUpdate = todos.filter(
        todo => todo.completed === allCompleted,
      );

      const updatePromises = todosToUpdate.map(todo => {
        const updatedTodo = { ...todo, completed: !allCompleted };

        return onUpdate(updatedTodo);
      });

      await Promise.all(updatePromises);

      const newTodos = todos.map(todo =>
        todo.completed === allCompleted
          ? { ...todo, completed: !allCompleted }
          : todo,
      );

      setTodos(newTodos);
    } catch (error) {
      setCurrentError(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAllTodos}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
