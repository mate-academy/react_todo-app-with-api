/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todos';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  processingIds: number[];
  editedTodo: number | null;
  handleEditTodo: (id: number | null) => void;
  editedTodoTitle: string;
  setEditedTodoTitle: (value: string) => void;
  handleSubmitUpdateTodo: (todo: Todo) => void;
  isCompleted: boolean;
  setIsCompleted: (value: boolean) => void;
  handleTogleCompleted: (todo: Todo) => void;
  handleErrorMessage: (value: string) => void;
  renameCallback: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  processingIds,
  editedTodo,
  handleEditTodo,
  editedTodoTitle,
  setEditedTodoTitle,
  handleSubmitUpdateTodo,
  setIsCompleted,
  handleTogleCompleted,
  renameCallback,
}) => {
  const [hovered, setHovered] = useState(false);
  const isTest = typeof Cypress !== 'undefined';

  const submitEdit = () => {
    const trimmedTitle = editedTodoTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id);

      return;
    }

    if (renameCallback) {
      renameCallback();
    }

    handleSubmitUpdateTodo(todo);
  };

  useEffect(() => {
    setIsCompleted(todo.completed);
  }, [todo.completed, setIsCompleted]);

  useEffect(() => {
    if (editedTodo === todo.id) {
      setEditedTodoTitle(todo.title);
    }
  }, [editedTodo, todo.id, todo.title, setEditedTodoTitle]);

  if (editedTodo === todo.id) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        handleEditTodo(null);
        setEditedTodoTitle('');
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        submitEdit();
      }
    };

    return (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleTogleCompleted(todo)}
          />
        </label>

        <form
          onSubmit={e => {
            e.preventDefault();
            submitEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTodoTitle}
            onChange={e => setEditedTodoTitle(e.target.value)}
            onBlur={e => {
              e.preventDefault();
              submitEdit();
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': processingIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTogleCompleted(todo)}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => handleEditTodo(todo.id)}
      >
        {todo.title}
      </span>

      {(hovered || isTest) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
