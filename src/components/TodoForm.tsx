import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: (title: string) => void;
  handleAddTodo: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
};

export const TodoForm: React.FC<Props> = React.memo(
  ({
    todos,
    handleAddTodo,
    isLoading,
    title,
    setTitle,
    inputRef,
    onToggleAll,
  }) => {
    const activeTodoExist = todos.every(todo => todo.completed);

    return (
      <header className="todoapp__header">
        {todos.length > 0 && !isLoading && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: activeTodoExist,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}

        <form onSubmit={handleAddTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={inputRef}
            value={title}
            onChange={event => setTitle(event.target.value)}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

TodoForm.displayName = 'TodoForm';
