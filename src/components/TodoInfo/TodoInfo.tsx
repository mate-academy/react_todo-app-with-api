import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ProcessState } from '../../utils/constants';

type Props = {
  todo: Todo;
  onCheck: (todosId: number[], completed: boolean) => void;
  onDelete: (id: number) => void;
  onEditTodo: (todo: Todo, title: string) => void;
  processingTodos: Map<number, ProcessState>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onCheck,
  onEditTodo,
  processingTodos,
}) => {
  const { id, title, completed } = todo;
  const [todoEditing, setTodoEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState(title);
  const waitingForTitleEditing = useRef(false);

  const onSubmitTitle = () => {
    const trimTitle = newTitle.trim();

    if (trimTitle === title) {
      setTodoEditing(false);
    }

    waitingForTitleEditing.current = true;

    onEditTodo(todo, trimTitle);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTodoEditing(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    if (todoEditing && inputRef.current) {
      inputRef.current.focus();
    }

    if (waitingForTitleEditing.current && !processingTodos.has(id)) {
      setTodoEditing(false);
      waitingForTitleEditing.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [processingTodos, id, todoEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          name="checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onCheck([todo.id], !completed)}
        />
      </label>

      {todoEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmitTitle();
              }
            }}
            onBlur={() => onSubmitTitle()}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setTodoEditing(true);
          }}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!todoEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            id === 0 ||
            (processingTodos.has(id) &&
              processingTodos.get(id)?.editing !== false),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
