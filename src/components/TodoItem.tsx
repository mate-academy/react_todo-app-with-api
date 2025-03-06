import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  titleEditingId: number | null;
  setTitleEditingId: (id: number | null) => void;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoIds: Set<number>;
  editTodo: (todo: Todo, newTodoTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  titleEditingId,
  setTitleEditingId,
  onDeleteTodo,
  loadingTodoIds,
  editTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [titleEditingId]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleDoubleClick = (todo: Todo) => {
    setTitleEditingId(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    todo: Todo,
  ) => {
    event.preventDefault();
    editTodo(todo, newTodoTitle.trim());
  };

  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      <label
        className="todo__status-label"
        htmlFor={`todoStatus-${id}`}
        aria-labelledby={`todoStatus-${id}`}
      >
        <input
          id={`todoStatus-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(todo)}
        />
      </label>
      {titleEditingId === id ? (
        <form
          onSubmit={event => handleSubmit(event, todo)}
          onBlur={event => handleSubmit(event, todo)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setTitleEditingId(null);
            }
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            ref={titleInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <TodoLoader loadingTodoIds={loadingTodoIds} todoId={id} />
    </div>
  );
};
