import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoForm } from './TodoForm';

type Props = {
  todos: Todo[];
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onClick: () => void;
}

export const Header: React.FC<Props> = ({
  todos, query, setQuery, onSubmit, tempTodo, inputRef, onClick,
}) => {
  const hasAllCompletedTodos =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: hasAllCompletedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={onClick}
        />
      )}
      <TodoForm
        query={query}
        setQuery={setQuery}
        onSubmit={onSubmit}
        disabled={!!tempTodo}
        inputRef={inputRef}
      />
    </header>
  );
}
