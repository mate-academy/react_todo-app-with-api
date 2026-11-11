import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  newTodo: string;
  addingTodo: boolean;
  onNewTodoChange: (value: string) => void;
  onAddTodo: (title: string) => void;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  newTodo,
  addingTodo,
  onNewTodoChange,
  onAddTodo,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form
      onSubmit={event => {
        event.preventDefault();
        onAddTodo(newTodo);
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={event => onNewTodoChange(event.target.value)}
        disabled={addingTodo}
      />
    </form>
  </header>
);
