import React, { useMemo } from 'react';
import classNames from 'classnames';

import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  title: string,
  onTitleChange: (newTitle: string) => void,
  onAddTodo: (title: string) => void,
  isInputEnabled: boolean,
  onUpdateAllTodosStatus: () => void,
  todos: Todo[],
  showError: (message: ErrorType) => void,
};

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onAddTodo,
  isInputEnabled,
  onUpdateAllTodosStatus,
  todos,
  showError,
}) => {
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);
  const isActiveTodos = activeTodos.length > 0;

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          aria-label="status toggler"
          className={classNames(
            'todoapp__toggle-all',
            { active: !isActiveTodos },
          )}
          onClick={onUpdateAllTodosStatus}
        />
      )}
      <AddTodoForm
        title={title}
        onTitleChange={onTitleChange}
        isInputEnabled={isInputEnabled}
        showError={showError}
        onAddTodo={onAddTodo}
      />
    </header>
  );
};
