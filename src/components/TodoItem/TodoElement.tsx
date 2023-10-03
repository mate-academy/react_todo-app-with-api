import React, {
  FormEvent, useContext, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../utils/TodoContext';

type Props = {
  todo: Todo
};

export const TodoElement: React.FC<Props> = ({
  todo,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    handlePatch,
    handleDelete,
    loadingItems,
  } = useContext(TodoContext);

  const handleTodoStatusChange = (newTodo: Todo) => {
    const data = {
      ...newTodo,
      completed: !newTodo.completed,
    };

    handlePatch(newTodo, data);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEdited(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (editedTitle === todo.title) {
      setEditedTitle('');
      setIsEdited(false);

      return;
    }

    if (editedTitle === '') {
      handleDelete(todo.id);

      return;
    }

    const data = {
      ...todo,
      title: editedTitle,
    };

    handlePatch(todo, data)
      .finally(() => {
        setEditedTitle('');
        setIsEdited(false);
      });
  };

  const handleLoading = (id: number): boolean => {
    return loadingItems.some((item) => item === id);
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames(['todo'], { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleTodoStatusChange(todo);
          }}
          checked={todo.completed}
        />
      </label>

      {isEdited && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          onBlur={(event) => handleSubmit(event)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onKeyUp={(event) => handleKeyUp(event)}
            ref={inputRef}
          />
        </form>
      )}

      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEdited(true);
              setEditedTitle(todo.title);
              setTimeout(() => {
                if (inputRef.current === null) {
                  return;
                }

                inputRef.current.focus();
              }, 0);
            }}
          >
            {editedTitle || todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { 'is-active': handleLoading(todo.id) })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
