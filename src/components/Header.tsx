import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { Errors } from '../types/Errors';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  onCreateTodo: ({ userId, title, completed }: Todo) => Promise<void>;
  onToogleAllTodos: () => void;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
  setTempTodo: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  completedTodosCount: number;
};

export const Header: React.FC<Props> = ({
  todos,
  onCreateTodo,
  onToogleAllTodos,
  setErrorMessage,
  setTempTodo,
  tempTodo,
  completedTodosCount,
}) => {
  const [inputTitle, setInputTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [tempTodo, todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputTitle.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsSubmitting(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: inputTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    onCreateTodo(newTodo)
      .then(() => setInputTitle(''))

      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.length === completedTodosCount,
            })}
            data-cy="ToggleAllButton"
            onClick={onToogleAllTodos}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={titleInput}
            value={inputTitle}
            disabled={isSubmitting}
            onChange={event => setInputTitle(event.target.value)}
          />
        </form>
      </header>
    </>
  );
};
