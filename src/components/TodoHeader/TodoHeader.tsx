import * as React from 'react';
import { useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { ERROR_MESSAGES } from '../../utils/constants';

type TodoHeaderProps = {
  todos: Todo[];
  isAdding: boolean;
  selectedTodo: Todo | null;
  handleToggleAll: () => void;
  onAddTodo: (title: string, onSuccess?: () => void) => void;
  onError: (message: string) => void;
};

const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  isAdding,
  selectedTodo,
  handleToggleAll,
  onAddTodo,
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && !selectedTodo) {
      inputRef.current?.focus();
    }
  }, [isAdding, selectedTodo, todos.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputRef.current?.value.trim() ?? '';

    if (!title) {
      onError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    onAddTodo(title, () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${
            todos.every(t => t.completed) ? 'active' : ''
          }`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          name="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

export default TodoHeader;
