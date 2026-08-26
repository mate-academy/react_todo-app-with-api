import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

type Props = {
  completedAllTodos: () => void;
  allCompleted: boolean;
  blockedInput: boolean;
  setError: (param: string) => void;
  handleAddTodo: (param: string) => Promise<boolean>;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  completedAllTodos,
  allCompleted,
  blockedInput,
  setError,
  handleAddTodo,
  todos,
}) => {
  const focusElement = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const newTitle = title.trim();

  useEffect(() => {
    if (blockedInput) {
      return;
    }

    focusElement.current?.focus();
  }, [blockedInput]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={completedAllTodos}
        />
      )}

      <form
        onSubmit={event => {
          event.preventDefault();

          if (newTitle === '') {
            setError(ErrorMessage.Empty);

            return;
          }

          handleAddTodo(newTitle).then(result => {
            if (result) {
              setTitle('');
            }
          });
        }}
      >
        <input
          data-cy="NewTodoField"
          ref={focusElement}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={blockedInput}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
