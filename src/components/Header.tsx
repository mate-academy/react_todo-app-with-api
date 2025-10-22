import React, { useState } from 'react';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NotificationErrors } from '../types/Errors';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setNotificationError: React.Dispatch<
    React.SetStateAction<NotificationErrors | null>
  >;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onToggleAll: () => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setNotificationError,
  setTempTodo,
  inputRef,
  onToggleAll,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setNotificationError(NotificationErrors.TitleEmpty);
      setTimeout(() => setNotificationError(null), 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);

    client
      .post<Todo>('/todos', newTempTodo)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setNotificationError(NotificationErrors.UnableToAdd);
        setTimeout(() => setNotificationError(null), 3000);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setTempTodo(null), 50);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
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
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={loading}
        />
      </form>
    </header>
  );
};
