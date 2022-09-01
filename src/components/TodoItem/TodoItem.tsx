import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onChange: (updatedTodo: Todo) => void;
  onError: (errorType: string) => void;
}
export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    onChange,
    onError,
  } = props;

  const [isLoading, setIsLoading] = useState(todo.isLoading);
  const [isInputActive, setIsInputActive] = useState(false);
  const [titleValue, setTitleValue] = useState(todo.title);
  const inputText = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(todo.isLoading);
  }, [todo.isLoading]);

  const handleToggleCheck = () => {
    setIsLoading(true);
    const newTodo = { ...todo, completed: !todo.completed };

    client.patch<Todo>(`/todos/${todo.id}`, newTodo)
      .then(res => onChange(res))
      .catch(() => {
        onError('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteTodo = () => {
    setIsLoading(true);

    client.delete(`/todos/${todo.id}`)
      .then(() => onDelete(todo.id))
      .catch(() => {
        onError('Unable to delete a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleTitleChange = () => {
    if (titleValue === todo.title) {
      setIsInputActive(false);

      return;
    }

    if (titleValue === '') {
      handleDeleteTodo();
      setIsInputActive(false);

      return;
    }

    setIsLoading(true);
    const newTodo = { ...todo, title: titleValue };

    client.patch<Todo>(`/todos/${todo.id}`, newTodo)
      .then(res => onChange(res))
      .catch(() => {
        onError('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputKeyPress
    = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleTitleChange();

        setIsInputActive(false);
      }

      if (event.key === 'Escape') {
        setIsInputActive(false);
      }
    };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleCheck()}
        />
      </label>

      {isInputActive ? (
        <>
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue="JS"
              ref={inputText}
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onKeyDown={(e) => handleInputKeyPress(e)}
              onBlur={() => {
                handleTitleChange();
                setIsInputActive(false);
              }}
            />
          </form>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setTitleValue(todo.title);
              setIsInputActive(true);
              setTimeout(() => inputText.current?.focus(), 0);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
