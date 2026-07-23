import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import { createTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (msg: ErrorMessage | null) => void;
  setTempTodo: (todo: Todo | null) => void;
  onToggleAll: () => Promise<void>;
  isAllCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
  onToggleAll,
  isAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoInputRef.current?.focus();
    }
  }, [isSubmitting, todos.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: 634,
    };

    setTempTodo(temp);
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newTodo = await createTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isSubmitting}
          autoFocus
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
