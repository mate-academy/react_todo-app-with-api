import React from 'react';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  todos: Todo[];
  loadingTodoId: number | null;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  loadingTodoId,
  newTitle,
  setNewTitle,
  addTodo,
  isInputDisabled,
  inputRef,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && !loadingTodoId && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default TodoHeader;
