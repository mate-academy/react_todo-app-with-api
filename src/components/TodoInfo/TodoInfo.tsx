import React, {
  ChangeEvent, useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    deleteTodoAction,
    loadingItems,
    changeTodoStatusAction,
    updateTodoAction,
  } = useContext(TodoContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isInEdit, setIsInEdit] = useState(false);
  const [value, setValue] = useState(todo.title);
  const isLoading = loadingItems.includes(todo.id);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInEdit]);

  const handleDelete = () => {
    deleteTodoAction(todo.id);
  };

  const handleChangeStatus = () => {
    changeTodoStatusAction(todo);
  };

  const handleDoubleClick = () => {
    setIsInEdit(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const saveChange = () => {
    updateTodoAction(value, todo.id);
    setValue(value);
    setIsInEdit(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveChange();
    }

    if (e.key === 'Escape') {
      setValue(value);
      setIsInEdit(false);
    }
  };

  const handleBlur = () => {
    if (isInEdit) {
      saveChange();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isInEdit,
      })}
      onDoubleClick={handleDoubleClick}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isInEdit ? (
        <form
          onSubmit={() => null}
          className="todo-edit-form"
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={handleEditChange}
            onBlurCapture={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>

          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', { 'is-active': isLoading })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
