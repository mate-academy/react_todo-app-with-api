import classNames from 'classnames';
import React, { memo, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setIsError: (error: boolean) => void;
  onErrorMessage: (error: string) => void;
  onAddTodo: (newTitle: string) => void;
  isAdding: boolean;
  shouldRanderActiveToggle: boolean;
  handelTodosStatus: () => void;
};

export const Header: React.FC<Props> = memo(
  ({
    newTodoField,
    setIsError,
    onErrorMessage,
    onAddTodo,
    isAdding,
    shouldRanderActiveToggle,
    handelTodosStatus,
  }) => {
    const [title, setTitle] = useState('');

    const handlerSubmitTodo = (event: React.FormEvent) => {
      event.preventDefault();

      if (!title) {
        setIsError(true);
        onErrorMessage("Title can't be empty");

        return;
      }

      setTitle('');
      onAddTodo(title);
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: shouldRanderActiveToggle,
          })}
          onClick={handelTodosStatus}
        />

        <form onSubmit={handlerSubmitTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
