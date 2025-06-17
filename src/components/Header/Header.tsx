import React from 'react';
import cn from 'classnames';

import { TodoForm } from '../TodoForm';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleAddTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (ErrorMessage: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAllCompleted: (completed: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  setErrorMessage,
  inputRef,
  handleToggleAllCompleted,
}) => {
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAllCompleted(!allTodosCompleted)}
        />
      )}

      <TodoForm
        handleAddTodo={handleAddTodo}
        setErrorMessage={setErrorMessage}
        inputRef={inputRef}
      />
    </header>
  );
};
