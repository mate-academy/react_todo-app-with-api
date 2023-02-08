import React, { FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type PropsType = {
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  createTodo: (title: string) => void,
  tempTodo: Todo | null;
  activeTodosQuantity: number | null
  hangleTaggleAllTodos: (isCompleted: boolean) => void;
};

export const TodoHeader: React.FC<PropsType> = React.memo(
  ({
    inputValue,
    setInputValue,
    createTodo,
    tempTodo,
    activeTodosQuantity,
    hangleTaggleAllTodos,
  }) => {
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      createTodo(inputValue);
    };

    const isCreatingNewTodo = !!tempTodo;

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeTodosQuantity },
          )}
          onClick={() => hangleTaggleAllTodos(!activeTodosQuantity)}
        />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            disabled={isCreatingNewTodo}
          />
        </form>
      </header>
    );
  },
);
