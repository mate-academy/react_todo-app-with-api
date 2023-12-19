import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { AppContext } from '../../contexts/appContext';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
  const {
    removeTodo,
    updateTodo,
    selectedTodoIds,
    displayError,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleEditStart = () => {
    setIsEdit(true);
    setEditTitle(todo.title);
  };

  const handleEditSave = async () => {
    try {
      setIsSaving(true);

      if (editTitle.trim() === '') {
        removeTodo(todo.id);

        return;
      }

      if (editTitle.trim() === todo.title) {
        setIsEdit(false);

        return;
      }

      const updatedTodo = { ...todo, title: editTitle.trim() };

      await updateTodo(updatedTodo);

      setEditTitle(updatedTodo.title);
    } catch (error) {
      displayError(ErrorType.UnableToUpdate);
    } finally {
      setIsSaving(false);
      setIsEdit(false);
    }
  };

  const handleEditCancel = () => {
    setIsEdit(false);
    setEditTitle(todo.title);
  };

  const handleToggleStatusChange = async () => {
    try {
      setIsSaving(true);

      const updatedTodo = { ...todo, completed: !todo.completed };

      await updateTodo(updatedTodo);
    } catch (error) {
      displayError(ErrorType.UnableToUpdate);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEdit,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleStatusChange}
        />
      </label>

      {!isEdit ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEditStart}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleEditSave}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleEditSave();
              }

              if (e.key === 'Escape') {
                handleEditCancel();
              }
            }}
            value={editTitle}
            ref={inputRef}
          />
        </form>
      )}

      {!isEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo.id)}
        >
          ×
        </button>
      )}

      {(isSaving || selectedTodoIds.includes(todo.id)) && (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isSaving || selectedTodoIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
});
