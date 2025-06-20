import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

interface PropsTodoItem {
  todo: Todo;
  handleToggleTodo: (todo: Todo) => void;
  processingTodoIds: number[];
  editingTodoId: number | null;
  handleUpdateTodo: (todo: Todo, newTitle: string) => void;
  setEditingTodoId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
  isTemp?: boolean;
}

export const TodoItem = ({
  todo,
  handleToggleTodo,
  processingTodoIds,
  editingTodoId,
  handleUpdateTodo,
  setEditingTodoId,
  handleDeleteTodo,
  isTemp,
}: PropsTodoItem) => {
  const [editedTitle, setEditedTitle] = useState('');

  const isBeingEdited = editingTodoId === todo.id && !isTemp;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo completion"
          onChange={() => handleToggleTodo(todo)}
          disabled={isTemp || processingTodoIds.includes(todo.id)}
        />
      </label>

      {isBeingEdited ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleUpdateTodo(todo, editedTitle.trim());
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={() => handleUpdateTodo(todo, editedTitle.trim())}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditingTodoId(null);
                setEditedTitle(todo.title);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            if (!isTemp) {
              setEditingTodoId(todo.id);
              setEditedTitle(todo.title);
            }
          }}
        >
          {todo.title}
        </span>
      )}

      {!isBeingEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={processingTodoIds.includes(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingTodoIds.includes(todo.id) || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
