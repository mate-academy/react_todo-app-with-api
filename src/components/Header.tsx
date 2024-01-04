import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorTitle } from '../types/TodoErrors';
import { USER_ID, createTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setToodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  togleAllComplited: () => void;
  loader: Record<number, boolean>;
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

const Header: React.FC<Props> = ({
  todos,
  setToodos,
  query,
  setQuery,
  isSubmitting,
  togleAllComplited,
  loader,
  setLoader,
  setErrorMessage,
  setTempTodo,
  setIsSubmitting,
}) => {
  const refInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [isSubmitting, todos.length]);

  function handlerAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(ErrorTitle.Title);

      return;
    }

    const fakeTodo = {
      title: query.trim(),
      completed: false,
      userId: USER_ID,
      id: 0,
    };

    setErrorMessage('');
    setLoader({ ...loader, [fakeTodo.id]: true });
    setTempTodo(fakeTodo);
    setIsSubmitting(true);
    createTodo({
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then((newPost) => {
        setToodos((currentPost) => [...currentPost, newPost]);
        setQuery('');
      })
      .catch((err) => {
        setErrorMessage(ErrorTitle.Add);
        throw Error(err);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        setLoader({ ...loader, [fakeTodo.id]: false });
      });
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={togleAllComplited}
          aria-label="Toggle all completed"
        />
      )}

      <form onSubmit={handlerAddTodo}>
        <input
          disabled={isSubmitting}
          ref={refInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default Header;
