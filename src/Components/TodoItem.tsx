import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?:(value:number) => void;
  isLoading?: boolean;
  loadingId?:number[];
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo = () => {},
  isLoading,
  onUpdateTodo,
  loadingId,
}) => {
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  const editedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedField.current) {
      editedField.current.focus();
    }
  }, [editedTodoId]);

  const savingEditing = () => {
    setEditedTodoId(null);

    if (newTitle === '' || newTitle.trim() === '') {
      deleteTodo(todo.id);
      setNewTitle(todo.title);

      return;
    }

    if ((newTitle !== todo.title)) {
      onUpdateTodo(todo.id, { title: newTitle })
        .catch(() => setNewTitle(todo.title));
    }
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setEditedTodoId(null);
    savingEditing();
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      { editedTodoId === todo.id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editedField}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={savingEditing}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditedTodoId(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={
        classNames('modal overlay',
          {
            'is-active': isLoading || loadingId?.includes(todo.id),
          })
      }
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader" />
      </div>
    </div>
  );
};
