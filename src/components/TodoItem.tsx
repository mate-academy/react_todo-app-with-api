import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { Method } from '../App';

type Props = {
  todo: Todo;
  editTodo?: boolean;
  setEditTodo: (id: number) => void;
  setRemoveEditTodo: () => void;
  isTempTodo?: boolean;
  loadingForTodo?: number[];
  handleDelete: (id: number) => void;
  handleUpdating: (todo: Todo, method: Method) => void;
  todoId?: number;
  updateTodoStatus: (todo: Todo) => void;
  setError: () => void;
  setUpdateError: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editTodo,
  setEditTodo,
  setRemoveEditTodo,
  isTempTodo = false,
  loadingForTodo,
  handleDelete,
  handleUpdating,
  todoId,
  updateTodoStatus,
  setError,
  setUpdateError,
}) => {
  const { title, completed, id } = todo;
  let currentTitle = title;

  const [newTitle, setNewTitle] = useState(title);

  const titleFieldForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFieldForm.current && editTodo) {
      titleFieldForm.current.focus();
    }
  }, [editTodo]);

  function submitUpdate() {
    if (newTitle.trim() === '') {
      handleDelete(id);
    }

    if (newTitle === currentTitle) {
      setRemoveEditTodo();
    }

    handleUpdating(todo, Method.add);

    updateTodo(todo, { title: newTitle })
      .then(() => {
        currentTitle = newTitle;
      })
      .catch(() => {
        setError();
        setUpdateError();
      })
      .finally(() => {
        handleUpdating(todo, Method.delete);
        setRemoveEditTodo();
      });
  }

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitUpdate();
  };

  const handleOnBlur = () => {
    submitUpdate();
  };

  const escFunction = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(currentTitle);
      setEditTodo(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={() => {
        if (!editTodo) {
          setEditTodo(id);
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => updateTodoStatus(todo)}
        />
      </label>

      {editTodo && todoId === id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleFieldForm}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={escFunction}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {newTitle.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTempTodo || loadingForTodo?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
