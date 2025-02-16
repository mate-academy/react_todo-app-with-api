/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isTemp: boolean;
  loadingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  loadingIds,
  setTodos,
  setError,
  setLoadingIds,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    if (editedTodo) {
      inputRef.current?.focus();
    }
  }, [editedTodo]);

  const handleDelete = () => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);

    deleteTodo(todo.id)
      .then(() =>
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todoItem => todoItem.id !== todo.id),
        ),
      )
      .catch(() => {
        setError(ErrorType.DeleteFail);
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleCheck = () => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);
    const newTodo = { ...todo, completed: !todo.completed };

    updateTodo(newTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? newTodo : todoItem,
          ),
        );
      })
      .catch(() => setError(ErrorType.UpdateFail))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleDoubleClick = () => {
    setEditedTodo(todo);
    setEditedTitle(todo.title);
  };

  const updateTodoTitle = () => {
    const normTitle = editedTitle.trim();

    if (normTitle.length === 0) {
      handleDelete();

      return;
    }

    if (normTitle === todo.title) {
      setEditedTodo(null);

      return;
    }

    setLoadingIds(prevIds => [...prevIds, todo.id]);

    const newTodo = { ...todo, title: normTitle };

    updateTodo(newTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? newTodo : todoItem,
          ),
        );
      })
      .catch(() => setError(ErrorType.UpdateFail))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheck}
        />
      </label>

      {editedTodo === todo ? (
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={updateTodoTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
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
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || loadingIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
