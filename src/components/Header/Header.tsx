import React, { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  addTodo: (
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  completeTodo: (todoId: number, status?: boolean) => void;
  tempTodo: Todo | null;
  allTodos: Todo[];
  completedTodos: Todo[];
  uncompletedTodos: Todo[];
};

export const Header: React.FC<Props> = ({
  addTodo,
  completeTodo,
  tempTodo,
  allTodos,
  completedTodos,
  uncompletedTodos,
}) => {
  const [title, setTitle] = useState<string>('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title, setTitle);
  };

  const handleToggleAll = () => {
    if (allTodos.length === completedTodos.length) {
      allTodos.forEach(todo => completeTodo(todo.id, false));
    } else {
      uncompletedTodos.forEach(todo => completeTodo(todo.id, true));
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allTodos.find(todo => todo.loading)) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [allTodos, tempTodo]);

  return (
    <header className="todoapp__header">
      {Boolean(allTodos.length) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.length === completedTodos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={Boolean(tempTodo)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
