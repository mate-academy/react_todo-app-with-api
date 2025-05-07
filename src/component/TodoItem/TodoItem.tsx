import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  removeTodo: (todoId: number[]) => void;
  updateStatusTodo: (todo: Todo[]) => void;
  // setError: (error: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  updateStatusTodo,
}) => {
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  // const [pressedEsc, setPressedEsc] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuery(query);
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);

    if (!query) {
      removeTodo([todo.id]);

      return;
    }

    if (query === todo.title) {
      return;
    }

    updateStatusTodo([
      {
        id: todo.id,
        userId: todo.userId,
        title: query,
        completed: !todo.completed,
      },
    ]);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'active'}`}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => updateStatusTodo([todo])}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={handleQueryChange}
            autoFocus
            onBlur={handleSubmit}
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
            onClick={() => removeTodo([todo.id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
