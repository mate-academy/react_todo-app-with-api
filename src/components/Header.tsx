import React from 'react';

import cn from 'classnames';
import { Todo } from '../types/Todo';
import Form from './Form';

type Props = {
  todos: Todo[];
  onCreateTodo: (todoTitle: string) => Promise<void>;
  isLoading: boolean;
  setErrorMessage: (message: string) => void;
  handleToggleAll: () => void;
  renamingTodo: number | null;
};

const Header: React.FC<Props> = ({
  todos,
  onCreateTodo,
  isLoading,
  setErrorMessage,
  handleToggleAll,
  renamingTodo,
}) => {
  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <Form
        onCreateTodo={onCreateTodo}
        isLoading={isLoading}
        setErrorMessage={setErrorMessage}
        renamingTodo={renamingTodo}
      />
    </header>
  );
};

export default Header;
