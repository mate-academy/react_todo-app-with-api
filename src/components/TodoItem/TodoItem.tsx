/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isTemp: boolean;
  deletingIds: number[];
  updatingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  deletingIds,
  updatingIds,
  setTodos,
  setError,
  setDeletingIds,
  setUpdatingIds,
}) => {
  const editTodoRef = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    editTodoRef.current?.focus();
  }, [selectedTodo]);

  const handleDelete = () => {
    setDeletingIds(prevIds => [...prevIds, todo.id]);

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
        setDeletingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleCheck = () => {
    setUpdatingIds(prevIds => [...prevIds, todo.id]);
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
        setUpdatingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const updateTodoTitle = () => {
    const normTitle = title.trim();

    if (normTitle.length === 0) {
      handleDelete();

      return;
    }

    if (normTitle === todo.title) {
      setSelectedTodo(null);

      return;
    }

    setUpdatingIds(prevIds => [...prevIds, todo.id]);

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
        setUpdatingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        updateTodoTitle();
        break;
      case 'Escape':
        setSelectedTodo(null);
        setTitle(todo.title);
        break;
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
          onClick={handleCheck}
          checked={todo.completed}
        />
      </label>

      {selectedTodo === todo ? (
        <form>
          <input
            data-cy="TodoTitleField"
            ref={editTodoRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={updateTodoTitle}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setSelectedTodo(todo)}
        >
          {todo.title}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </span>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || deletingIds.includes(todo.id) || updatingIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
