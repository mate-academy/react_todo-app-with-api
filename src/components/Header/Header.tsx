import React, { ChangeEvent, FormEvent } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  todoTitle: string;
  setTodoTitleWrapper: (value: string) => void;
  setErrorWrapper: (error: Error) => void;
  addNewTodo: () => void;
  isLoading: boolean;
  isAllTodosCompleted: boolean;
  toggleAllTodosStatus: (status: boolean) => void;
  haveTodos: boolean;
};

export const Header: React.FC<Props> = ({
  todoTitle,
  setTodoTitleWrapper,
  setErrorWrapper,
  addNewTodo,
  isLoading,
  isAllTodosCompleted,
  toggleAllTodosStatus,
  haveTodos,
}) => {
  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitleWrapper(value);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      setErrorWrapper(Error.EMPTY);

      return;
    }

    addNewTodo();

    setTodoTitleWrapper('');
  };

  const handleToggleButtonClick = () => {
    let completedValue;

    if (isAllTodosCompleted) {
      completedValue = false;
    } else {
      completedValue = true;
    }

    toggleAllTodosStatus(completedValue);
  };

  return (
    <header className="todoapp__header">
      {haveTodos && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: isAllTodosCompleted,
            },
          )}
          aria-label="Toggle-active"
          onClick={handleToggleButtonClick}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={todoTitle}
          onChange={changeTitle}
        />
      </form>
    </header>
  );
};
