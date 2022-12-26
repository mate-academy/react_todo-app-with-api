import classNames from 'classnames';
import React from 'react';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { NewTodo } from '../NewTodo';

type Props = {
  toggleAllTodoStatus: () => Promise<void>,
  addNewTodo: (title: string) => void,
  isAdding: boolean,
  setIsErrorMessage: (value: ErrorTypes) => void,
  activeTodosCount: number,
};

export const Header: React.FC<Props> = ({
  toggleAllTodoStatus,
  addNewTodo,
  isAdding,
  setIsErrorMessage,
  activeTodosCount,
}) => (
  <header className="todoapp__header">
    <button
      aria-label="ToggleAllButton"
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: !activeTodosCount },
      )}
      onClick={toggleAllTodoStatus}
    />

    <NewTodo
      addNewTodo={addNewTodo}
      isAdding={isAdding}
      setIsErrorMessage={setIsErrorMessage}
    />
  </header>
);
