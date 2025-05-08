import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  // isDeleted: boolean;
  removeTodo: (todoId: number[]) => void;
  updateStatusTodo: (todo: Todo[]) => Promise<void>;
  // setError: (error: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  updateStatusTodo,
  // isDeleted,
}) => {
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

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
  }, [query, setIsEditing]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
    const tempQuery = query.trim();

    // update like statusTodo
    if (!tempQuery) {
      removeTodo([todo.id]);

      return;
    }

    if (tempQuery === todo.title) {
      return;
    }

    try {
      await updateStatusTodo([
        {
          id: todo.id,
          userId: todo.userId,
          title: tempQuery,
          completed: !todo.completed,
        },
      ]);
      setIsEditing(false);
    } catch (err) {
      setIsEditing(true);
      setQuery(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            updateStatusTodo([todo]);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
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
