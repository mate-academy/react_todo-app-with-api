import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: () => void,
  toggleStatusTodo: () => void,
  renameTodo: (todo: Todo, newTitle: string) => void,
  loading: { todoId: number, isLoading: boolean },
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleStatusTodo,
  renameTodo,
  loading,
}) => {
  const [isRenamed, setIsRenamed] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      deleteTodo();

      return;
    }

    if (newTitle !== todo.title) {
      renameTodo(todo, newTitle);
    }

    setIsRenamed(false);
  };

  const reset = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleSubmit(event);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={toggleStatusTodo}
        />
      </label>

      {isRenamed ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyUp={reset}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsRenamed(!isRenamed)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active':
          todo.id === 0 || (todo.id === loading.todoId && loading.isLoading),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
