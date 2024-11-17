/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState, useEffect } from 'react';
import { changeTodo } from '../api/todos';

interface TodoComponentProps {
  todo: Todo;
  isLoading: boolean;
  tempTodo: Todo | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, currentCompletedStatus: boolean) => void;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
}

export const TodoComponent: React.FC<TodoComponentProps> = ({
  todo,
  isLoading,
  tempTodo,
  inputRef,
  onTodoDelete,
  onTodoToggle,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(todo.title);

  const onDoubleClickHandler = () => {
    setIsEditing(true);
    setInputValue(todo.title);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setInputValue(todo.title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!inputValue.trim()) {
      onTodoDelete(todo.id);

      return;
    }

    if (inputValue === todo.title) {
      setIsEditing(false);

      return;
    } else {
      const updatedTodo = {
        ...todo,
        title: inputValue.trim(),
      };

      onUpdateTodo(updatedTodo)
        .then(() => setIsEditing(false))
        .catch(() => {});
    }
  };

  const handleBlur = () => {
    const preparedInputValue = inputValue.trim();

    if (!preparedInputValue) {
      onTodoDelete(todo.id);
    }

    if (preparedInputValue === todo.title) {
      setIsEditing(false);

      return;
    }

    if (preparedInputValue) {
      onUpdateTodo({ ...todo, title: preparedInputValue });
      changeTodo(todo.id, { title: preparedInputValue });
    }

    setIsEditing(false);
  };

  const isTempTodo = tempTodo && tempTodo.id === todo.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

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
          disabled={isTempTodo || isLoading}
          onChange={() => onTodoToggle(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={inputValue}
            placeholder="Empty todo will be deleted"
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClickHandler}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isTempTodo || isLoading}
          onClick={() => onTodoDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
