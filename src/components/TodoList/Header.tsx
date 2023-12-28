import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Props } from '../../types/Header';

export const Header: React.FC<Props> = ({
  todosLength,
  handleCreateTodo,
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

  return (
    <header className="todoapp__header">
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

      <form onSubmit={(event) => handleCreateTodo(
        event,
        todoTitle,
        setIsInputDisabled,
        setTodoTitle,
      )}
      >
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
