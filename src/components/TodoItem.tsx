import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { AppContext } from '../AppContext';
import { ErrorType } from '../types/Errors';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const { todo } = props;
  const {
    deleteTodo,
    updateTodo,
    selectedTodoIds,
    shouError,
    handleToggleCompleted,
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

  const handleEditCancel = () => {
    setIsEdit(false);
    setEditTitle(todo.title);
  };

  const handleEditSave = async () => {
    try {
      setIsSaving(true);

      if (editTitle.trim() === '') {
        deleteTodo(todo.id);

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
      shouError(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsSaving(false);
      setIsEdit(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditSave();
    }

    if (event.key === 'Escape') {
      handleEditCancel();
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
          onChange={() => handleToggleCompleted(todo)}
        />
      </label>

      {!isEdit ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditStart}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyUp={(e) => handleKeyUp(e)}
            value={editTitle}
            ref={inputRef}
          />
        </form>
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
