/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import {
  FormEventHandler, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorMess } from '../types/Error';

type Props = {
  todo: Todo;
  handleDelete: (todo: Todo, callback: () => void) => void;
  handleComplete: (todo: Todo, callback: () => void) => void;
  handleError: (err: ErrorMess) => void;
};

export const TodoItem = ({
  todo, handleDelete, handleComplete, handleError,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTodoEdited, setIsTodoEdited] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsTodoEdited(true);
    setEditedTodoTitle(todo.title);
  };

  const handleEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTodoTitle(todo.title);
      setIsTodoEdited(false);
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (editedTodoTitle === todo.title) {
      setIsLoading(false);
      setIsTodoEdited(false);

      // eslint-disable-next-line no-useless-return
      return;
    }

    if (editedTodoTitle === '') {
      setIsLoading(true);
      handleDelete(todo, () => setIsLoading(false));

      return;
    }

    updateTodo(todo.id, {
      title: editedTodoTitle,
    }).then(() => {
      todo.title = editedTodoTitle;
    }).catch(() => {
      handleError('Unable to update a todo');
    }).finally(() => {
      setIsLoading(false);
      setIsTodoEdited(false);
    });
  };

  useEffect(() => {
    if (isTodoEdited) {
      editInputRef.current?.focus();
    }
  }, [isTodoEdited]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            setIsLoading(true);
            handleComplete(todo, () => setIsLoading(false));
          }}
        />
      </label>
      {!isTodoEdited
      && (
        <>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={(handleDoubleClick)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsLoading(true);
              handleDelete(todo, () => setIsLoading(false));
            }}
          >
            ×
          </button>
        </>
      )}
      {isTodoEdited && (
        <form onSubmit={handleSubmit}>
          <input
            onBlur={handleSubmit}
            ref={editInputRef}
            className="todo__title-field"
            value={editedTodoTitle}
            type="text"
            onChange={(e) => setEditedTodoTitle(e.target.value)}
            onKeyUp={handleEsc}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
