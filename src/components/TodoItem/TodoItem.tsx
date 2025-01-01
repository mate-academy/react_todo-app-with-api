import React, { useState, useCallback, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number, onFail: () => void) => void;
  loading?: boolean;
  handleUpdateTodo: (updatedTodo: Todo, onFail: () => void) => void;
  loadingTodoId: number | null;
  handleToggleTodo: (todoId: number, todo: Todo) => void;
  toggleId?: number | null;
  updatingTodos: number[];
};

const TodoItem: React.FC<Props> = React.memo(({ todo, handleDeleteTodo, loading = false, handleUpdateTodo, loadingTodoId, handleToggleTodo, toggleId, updatingTodos }) => {

  const { id, title, completed } = todo;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(title);
  const [isEditingTodo, setIsEditingTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditTodo = () => {
    setIsEditing(true);
  };
  

  const handleSubmitEditedTodo = useCallback(() => {
    const newTrimmedTitle = editedTodoTitle.trim();

    if (!newTrimmedTitle) {
      setIsEditingTodo(true);

      handleDeleteTodo(id, () => {

        setIsEditing(true);
      });
      setIsEditingTodo(false);
      inputRef.current?.focus();
      return;
    }

    if (newTrimmedTitle !== title) {
      handleUpdateTodo(
        { ...todo, title: newTrimmedTitle },
        () => {
          setIsEditing(true);
        }
      );
    }

    setIsEditing(false);
  }, [editedTodoTitle, handleDeleteTodo, handleUpdateTodo, id, title, todo]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editedTodoTitle.trim() !== title) {
        handleSubmitEditedTodo();
      } else {
        setIsEditing(false);
      }
    }
  };


  const handleCancelEditTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditedTodoTitle(title);
    }
  };


  const handleBlurTodo = () => {
    handleSubmitEditedTodo();
  };


  return (
    <div data-cy="Todo" className={cn("todo", { "completed": completed })}>
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        {" "}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          id={`todo-${id}`}
          disabled={loading}
          onChange={() => handleToggleTodo(id, todo)}
        />
      </label>

      {isEditing || loadingTodoId === id || isEditingTodo  ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTodoTitle}
            placeholder="Empty todo will be deleted"
            onChange={(e) => setEditedTodoTitle(e.target.value)}
            onBlur={handleBlurTodo}
            onKeyDown={handleKeyPress}
            autoFocus
            onKeyUp={handleCancelEditTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditTodo}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={
              () => {
                handleDeleteTodo(id,  () => {});
                setDeleteId(id);
              }}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader"
        className={cn("modal overlay", {
          "is-active":
            (id === 0 && loading) ||
            (deleteId !== null && loading) ||
            loadingTodoId === id ||
            toggleId === id ||
            isEditingTodo ||
            updatingTodos.includes(id)
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

TodoItem.displayName = 'TodoItem';
export default TodoItem;


