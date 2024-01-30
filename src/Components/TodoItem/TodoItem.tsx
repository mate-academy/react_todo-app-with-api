import React, {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';

import { Context } from '../../Context';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    todos,
    globalLoading,
    setErrorMessage,
    setTodos,
  } = useContext(Context);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(title);

  inputRef.current?.focus();

  const handleEdit = () => {
    setEditing(true);

    if (inputRef.current) {
      inputRef.current.value = title;
    }
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setIsLoading(true);

    updateTodo(updatedTodo)
      .then(currentTodos => {
        setTodos(prevTodos => {
          const newTodos: Todo[] = [...prevTodos];
          const index = newTodos
            .findIndex(newTodo => newTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, currentTodos);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_UPDATE))
      .finally(() => setIsLoading(false));
  };

  const handleRemoveTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => setTodos(todos.filter(item => item.id !== id)))
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_DELETE));
  };

  const handleTitleUpdate = () => {
    if (!inputRef.current) {
      return;
    }

    if (inputRef.current.value.trim()) {
      handleUpdateTodo({
        ...todo,
        title: inputRef.current.value,
      });
    } else {
      handleRemoveTodo(id);
    }

    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTitleUpdate();
    } else if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [editing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onBlur={() => setEditing(false)}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-${id}`}
          checked={completed}
          onChange={() => handleUpdateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {editing ? (
        <form onSubmit={handleTitleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditing(false)}
          />
        </form>
      ) : (
        <>
          <div
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              handleEdit();
              inputRef.current?.focus();
            }}
          >
            {title}
          </div>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {(isLoading
        || globalLoading)
      && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
