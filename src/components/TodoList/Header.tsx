import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todosLength: number,
  handleCreateTodoSubmit: (
    title: string,
    setDisabled: (value: boolean) => void,
    setTitle: (value: string) => void
  ) => void;
  handleToggleAll: () => void;
  isAllTodoCompleted: boolean;
  focusToHeaderInput: boolean;
};

export const Header: React.FC<Props> = ({
  todosLength,
  handleCreateTodoSubmit,
  handleToggleAll,
  isAllTodoCompleted,
  focusToHeaderInput,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const createTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createTodo.current) {
      createTodo.current.focus();
    }
  }, [isInputDisabled, focusToHeaderInput]);

  const handleCreateTodo = (event: React.FormEvent) => {
    event.preventDefault();

    handleCreateTodoSubmit(
      todoTitle,
      setIsInputDisabled,
      setTodoTitle,
    );
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todosLength > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          aria-label="toggle button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          onClick={() => handleToggleAll()}
        />
      )}

      <form onSubmit={handleCreateTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={isInputDisabled}
          ref={createTodo}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
