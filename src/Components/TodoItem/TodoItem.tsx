/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';
import { Todo } from '../../types/Todo';

export const TodoItem: React.FC<{ todo: Todo }> = React.memo(({ todo }) => {
  const {
    loadingTodos,
    editingTodo,
    handleEditing,
    setHandleEditing,
    setIsChosenToRename,
    setEditingTodo,
    handleDelete,
    makeTodoCompleted,
  } = useContext(TodoContext);

  const handleTodoTitle = () => {
    return editingTodo.trim() && handleEditing === todo.id ? (
      editingTodo.trim()
    ) : todo.title;
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => makeTodoCompleted(todo.id, todo.completed)}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        role="button"
        tabIndex={0}
        onDoubleClick={() => {
          if (!handleEditing) {
            setIsChosenToRename(todo.id);
            setEditingTodo(todo.title);
            setHandleEditing(todo.id);
          }
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            setHandleEditing(todo.id);
          }
        }}
      >
        {handleTodoTitle()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
