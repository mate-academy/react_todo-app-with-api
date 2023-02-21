import classNames from 'classnames';
import React, { ChangeEvent, FormEvent } from 'react';
import { Error } from '../../types/Error';

type Props = {
  todoTitle: string;
  onTodoTitleChange: (value: string) => void;
  handleErrors: (error: Error) => void;
  addNewTodo: () => void;
  isLoading: boolean;
  isAllTodosCompleted: boolean;
  toggleAllTodosStatus: (status: boolean) => void;
};

export const TodoForm: React.FC<Props> = (
  {
    todoTitle,
    onTodoTitleChange,
    handleErrors,
    addNewTodo,
    isLoading,
    isAllTodosCompleted,
    toggleAllTodosStatus,
  },
) => {
  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    onTodoTitleChange(value);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      handleErrors(Error.EMPTY);

      return;
    }

    addNewTodo();

    onTodoTitleChange('');
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
      {/* this buttons is active only if there are some active todos */}
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

      {/* Add a todo on form submit */}
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
