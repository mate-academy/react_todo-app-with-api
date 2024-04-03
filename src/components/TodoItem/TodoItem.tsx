import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../utils/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { removeTodo, loadingTodosIDs, toggleTodo, renameTodo } = useTodos();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>(todo.title);
  const isActiveLoading = loadingTodosIDs.includes(todo.id) || todo.id === 0;

  const toggleEditTodo = () => {
    setEditingTodoId(todo.id);
    setEditedText(todo.title);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleRename = async () => {
    const newText = editedText.trim();

    if (newText === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!newText) {
      removeTodo(todo.id);
    } else {
      renameTodo(todo.id, newText, async () => setEditingTodoId(null));
    }
  };

  const handleEditInputKeyUp = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      await handleRename();
    }

    if (e.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={toggleEditTodo}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {!editingTodoId ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedText}
            onChange={handleEditInputChange}
            onKeyUp={handleEditInputKeyUp}
            onBlur={handleRename}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActiveLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
