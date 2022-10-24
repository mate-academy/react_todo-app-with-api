import classNames from 'classnames';
import React, { useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  todoTitle: string,
  isAdding: boolean,
  isActiveToggleAllButton: boolean,
  applyTodoTitle: (query: string) => void,
  setTodoTitle: (value: string) => void,
  handleChangeToggleAllButton: () => void,
  handleAddTodoToTheList: (value: React.FormEvent) => void,
};

export const Header: React.FC<Props> = React.memo(
  ({
    todos,
    todoTitle,
    isAdding,
    isActiveToggleAllButton,
    applyTodoTitle,
    setTodoTitle,
    handleAddTodoToTheList,
    handleChangeToggleAllButton,
  }) => {
    const newTodoField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAdding]);

    return (
      <header className="todoapp__header">
        {(todos.length !== 0) && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: isActiveToggleAllButton },
            )}
            onClick={handleChangeToggleAllButton}
          >
            <></>
          </button>
        )}

        <form onSubmit={(event) => handleAddTodoToTheList(event)}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={({ target }) => {
              setTodoTitle(target.value);
              applyTodoTitle(target.value);
            }}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
