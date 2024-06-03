import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  onTodoDeleteButton: (todoId: number) => void;
  todo: Todo;
  loadingTodoIds: number[];
  onTodoStatus: (todoId: number, completed: boolean) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleError: (errorMessage: ErrorTypes) => void;
};

export const TodoItem: React.FC<Props> = ({
  onTodoDeleteButton,
  todo,
  loadingTodoIds,
  onTodoStatus,
  setLoadingTodoIds,
  setTodos,
  handleError,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { checked } = e.target;

    onTodoStatus(todo.id, checked);
  };

  const handleBlur = () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setLoadingTodoIds(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos((todos: Todo[]) =>
            todos.filter(todoId => todoId.id !== todo.id),
          );
        })
        .catch(() => {
          handleError(ErrorTypes.UnableToDelete);
        });
    } else if (todo.title !== trimmedTitle) {
      setLoadingTodoIds(prev => [...prev, todo.id]);
      updateTodo(todo.id, trimmedTitle, todo.completed)
        .then(updatedTodo => {
          setIsEditMode(false);
          setTodos((todos: Todo[]) =>
            todos.map(todoID => (todoID.id === todo.id ? updatedTodo : todoID)),
          );
        })
        .catch(() => {
          setIsEditMode(true);

          if (inputRef.current) {
            inputRef.current.focus();
          }

          handleError(ErrorTypes.UnableToUpdate);
        })
        .finally(() => {
          setLoadingTodoIds(prev => prev.filter(item => item !== todo.id));
        });
    } else {
      setIsEditMode(false);
    }

    if (todo.title !== trimmedTitle) {
      setNewTitle(trimmedTitle);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleBlur();
  };

  const handleEscapeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === 'Escape') {
      setIsEditMode(false);
      setNewTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        aria-label="Todo status"
        className="todo__status-label"
        htmlFor={`todo-${todo.id}`}
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <input
            id={todo.id.toString()}
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleEscapeKey}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditMode(true);
              setNewTitle(todo.title.trim());
            }}
          >
            {newTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDeleteButton(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
