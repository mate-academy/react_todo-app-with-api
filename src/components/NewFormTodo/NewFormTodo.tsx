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
  haveTodos: boolean;
};

export const NewFormTodo: React.FC<Props> = React.memo(
  (
    {
      todoTitle,
      onTodoTitleChange,
      handleErrors,
      addNewTodo,
      isLoading,
      isAllTodosCompleted,
      toggleAllTodosStatus,
      haveTodos,
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
      toggleAllTodosStatus(!isAllTodosCompleted);
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
  },
);
