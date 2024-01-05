import React, {
  FC,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { AppContext } from '../../ContextProvider/AppContext';
import { ErrorType } from '../../types/Errors';

type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ((props) => {
  const { todo } = props;
  const {
    deleteTodo,
    patchTodo,
    selectedTodoIds,
    showError,
    handleToggleCompleted,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleEditStart = () => {
    setIsEdit(true);
    setNewTitle(todo.title);
  };

  const NEWTITLECLEAR = newTitle.trim();

  const handleEditSave = async () => {
    try {
      setIsSaving(true);

      if (!NEWTITLECLEAR) {
        deleteTodo(todo.id);

        return;
      }

      if (NEWTITLECLEAR === todo.title) {
        setIsEdit(false);

        return;
      }

      const updatedTodo = { ...todo, title: NEWTITLECLEAR };

      patchTodo(updatedTodo);

      setNewTitle(updatedTodo.title);
    } catch (error) {
      showError(ErrorType.UPDATE);
    } finally {
      setIsSaving(false);
      setIsEdit(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditSave();
  };

  const isLoading = isSaving || selectedTodoIds.includes(todo.id);

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
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleEditSave}
            value={newTitle}
            ref={inputRef}
          />
        </form>
      )}

      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
});
