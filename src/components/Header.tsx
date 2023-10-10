/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessage';
import { USER_ID } from '../utils/Constants';

type Props = {
  onToddoAdd: (todoTitle: string) => Promise<void>;
  onToggleChange: (todo: Todo) => void;
  todos: Todo[],
  inputRef: React.RefObject<HTMLInputElement>;
  setTempTodo: (value: Todo | null) => void;
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
  setErrorMessage: (value: ErrorMessages) => void;
  todoTitle: string;
  setTodoTitle: (value: string) => void;
};

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
      setErrorMessage(ErrorMessages.EmptyTitle);

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
        setErrorMessage(ErrorMessages.UnableAddTodo);
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  const handleToggleAll = () => {
    const noCompletedTodos = todos.filter(todo => !todo.completed);

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
