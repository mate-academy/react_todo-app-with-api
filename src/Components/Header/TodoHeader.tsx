import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  onAdd: (newTodo: Todo) => Promise<void>;
  onUpdate: (redactedTodo: Todo) => Promise<void>;
  setError: (error: Errors | null) => void;
  processing: number | null;
  setTodosQuantity: (todosQuantity: number) => void;
  isEditing: number | null;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAdd,
  onUpdate,
  setError,
  setTodosQuantity,
  processing,
  isEditing,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      setError(Errors.Empty);

      return;
    }

    onAdd({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    }).then(() => setTitle(''));
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      return todos.map(todo =>
        onUpdate({
          ...todo,
          completed: false,
        }).finally(() => setTodosQuantity(todos.length)),
      );
    } else {
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      return uncompletedTodos.map(todo =>
        onUpdate({
          ...todo,
          completed: true,
        }).finally(() => setTodosQuantity(0)),
      );
    }
  };

  useEffect(() => {
    if (inputRef.current && !processing && !isEditing) {
      inputRef.current.focus();
    }
  }, [processing, isEditing]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={processing !== null}
        />
      </form>
    </header>
  );
};
