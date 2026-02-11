/* eslint-disable @typescript-eslint/indent */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  loadingTodos: number | null;
  handleCheckTodo: (id: number) => void;
  onSave: (
    todoEdited: Todo,
    event: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => void;
  editingTodo: boolean;
  setEditingTodo: (id: number | null) => void;
  onEditing: () => void;
  onDelete: (id: number) => void;
};

export function TodoItem({
  todo,
  loadingTodos,
  handleCheckTodo,
  onSave,
  editingTodo,
  setEditingTodo,
  onEditing,
  onDelete,
}: TodoItemProps) {
  const [newTitle, setNewTitle] = useState<string>('');

  const handleEditTodo = (todoEdited: Todo) => {
    onEditing();
    setNewTitle(todoEdited.title);
  };

  function handleCancel(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setEditingTodo(null);
    }
  }

  const handleFormSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (todo.title === newTitle) {
      setEditingTodo(null);
    } else if (newTitle.trim() === '') {
      onDelete(todo.id);
    } else {
      onSave({ ...todo, title: newTitle.trim() }, event);
    }
  };

  if (editingTodo) {
    return (
      <div data-cy="Todo" className="todo" key={todo.id}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form onSubmit={event => handleFormSubmit(event)}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={event => handleFormSubmit(event)}
            onKeyUp={handleCancel}
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': loadingTodos === todo.id || loadingTodos === -1,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  } else {
    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        key={todo.id}
        onDoubleClick={() => handleEditTodo(todo)}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => handleCheckTodo(todo.id)}
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': loadingTodos === todo.id || loadingTodos === -1,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }
}
