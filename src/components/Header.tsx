/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessage';

type Props = {
  onToddoAdd: (todoTitle: string) => Promise<void>;
  onToggleChange: (todo: Todo) => void;
  todos: Todo[],
  inputRef: React.RefObject<HTMLInputElement>;
  setTempTodo: (value: Todo | null) => void;
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  todoTitle: string;
  setTodoTitle: (value: string) => void;
};

const USER_ID = 11516;

export const Header: React.FC<Props> = ({
  onToddoAdd,
  onToggleChange,
  todos,
  inputRef,
  setTempTodo,
  isDisabled,
  setIsDisabled,
  setErrorMessage,
  todoTitle,
  setTodoTitle,
}) => {
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => (
    setTodoTitle(e.target.value)
  );

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedTitle = todoTitle.trim();

    if (!normalizedTitle.length) {
      setErrorMessage(ErrorMessages.EmptyTitleError);

      return;
    }

    setTempTodo({
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
      id: 0,
    });
    setIsDisabled(true);

    onToddoAdd(todoTitle)
      .then(() => setTodoTitle(''))
      .catch(() => {
        setErrorMessage(ErrorMessages.AddError);
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  const noCompletedTodos = todos.filter(todo => !todo.completed);

  const handleToggleAll = () => {
    if (noCompletedTodos.length) {
      noCompletedTodos.forEach(todo => onToggleChange(todo));
    } else {
      todos.forEach(todo => onToggleChange(todo));
    }
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll()}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          ref={inputRef}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
