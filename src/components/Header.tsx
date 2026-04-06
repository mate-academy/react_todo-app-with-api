import React from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants';
import * as todoService from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type HeaderProps = {
  todos: Todo[];
  setError: (message: string) => void;
  title: string;
  setTitle: (value: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setError,
  title,
  setTitle,
  setTempTodo,
  setTodos,
  inputRef,
  tempTodo,
  setProcessingIds,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await todoService.addTodo(newTempTodo);

      setTodos(prev => [...prev, addedTodo]);
      setTempTodo(null);
      setTitle('');

      setTimeout(() => {
        inputRef.current?.focus();
      });
    } catch {
      setError(ErrorMessage.AddTodo);
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      });

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleToggleAll = async () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    setProcessingIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          todoService.updateTodo(todo.id, { completed: newCompletedStatus }),
        ),
      );

      setTodos(prev =>
        prev.map(todo =>
          todosToUpdate.some(t => t.id === todo.id)
            ? { ...todo, completed: newCompletedStatus }
            : todo,
        ),
      );
    } catch {
      setError(ErrorMessage.UpdateTodos);
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !todosToUpdate.some(t => t.id === id)),
      );
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
          autoFocus
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
