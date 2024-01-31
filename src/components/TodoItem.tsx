import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { deleteTodo, updateTodo } from '../api/todos';
import { ErrorType, Todo } from '../types';

interface Props {
  todo: Todo;
  filterTodoList: (todoId: number) => void;
  setErrorMessage: (setErrorMessage: ErrorType | null) => void;
  handleTodoUpdated: (todo: Todo) => void;
  currentEditing: number | null;
  setCurrentEditing: (id: number | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  filterTodoList,
  setErrorMessage,
  handleTodoUpdated,
  currentEditing,
  setCurrentEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentEditing]);

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);
    deleteTodo(todoId)
      .then(() => {
        filterTodoList(todoId);
      })
      .catch(() => {
        setErrorMessage(ErrorType.DELETE);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateTodo = (
    todoId: number,
    userId: number,
    title: string,
    completed: boolean,
  ) => {
    setLoading(true);

    updateTodo(todoId, userId, title, completed)
      .then((res) => {
        handleTodoUpdated(res);
      })
      .catch(() => setErrorMessage(ErrorType.UPDATE))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSaveChanges = () => {
    if (value.trim().length === 0) {
      handleDeleteTodo(todo.id);
    } else {
      handleUpdateTodo(todo.id, todo.userId, value, todo.completed);
    }

    setCurrentEditing(null);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setValue(todo.title);
      setCurrentEditing(null);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSaveChanges();
  };

  const handleCheckboxClick = () => {
    handleUpdateTodo(
      todo.id,
      todo.userId,
      todo.title,
      !todo.completed,
    );
  };

  const handleInputBlur = () => {
    setCurrentEditing(null);
    handleSaveChanges();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={handleCheckboxClick}
        />
      </label>

      {todo.id === currentEditing
        ? (
          <form
            onSubmit={handleFormSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setCurrentEditing(todo.id)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
