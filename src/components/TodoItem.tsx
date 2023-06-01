import cn from 'classnames';
import {
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTodoContext } from '../context/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

interface Props {
  todo: Todo;

  isTodoLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isTodoLoading }) => {
  const {
    setTodos,
    setError,
    todoIdsInUpdating,
    isCompletedTodosLoading,
  } = useTodoContext();

  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const isCurrUpdating = todoIdsInUpdating.includes(todo.id);

  const handleTodoDelete = async () => {
    setIsLoading(true);

    try {
      await deleteTodo(todo.id);

      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
      setIsLoading(false);
    } catch (error) {
      setError(Error.DELETE);
      setIsLoading(false);
    }
  };

  const handleTodoStatusChange = async () => {
    setIsLoading(true);

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      await updateTodo(todo.id, updatedTodo);
      setTodos((prevTodos) => {
        return prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
      });

      setIsLoading(false);
    } catch {
      setError(Error.UPDATE);
      setIsLoading(false);
    }
  };

  const handleTodoEdit = async () => {
    setIsLoading(true);

    const updatedTodo = {
      ...todo,
      title: updatedTodoTitle,
    };

    try {
      await updateTodo(todo.id, updatedTodo);
      setTodos((prevTodos) => {
        return prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
      });

      setIsTodoEditing(false);
      setIsLoading(false);
    } catch {
      setError(Error.UPDATE);
      setIsLoading(false);
    }
  };

  const handleTitleEdit = () => {
    setIsTodoEditing(false);

    if (todo.title === updatedTodoTitle) {
      return;
    }

    if (updatedTodoTitle.trim()) {
      handleTodoEdit();
    } else {
      handleTodoDelete();
    }
  };

  const handleTodoTitleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    handleTitleEdit();
  };

  useEffect(() => {
    if (isTodoEditing) {
      inputRef.current?.focus();
    }
  }, [isTodoEditing]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUpdatedTodoTitle(todo.title);
        setIsTodoEditing(false);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [todo]);

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoStatusChange}

        />
      </label>

      {isTodoEditing ? (
        <form onSubmit={handleTodoTitleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={updatedTodoTitle}
            onChange={(event) => setUpdatedTodoTitle(event.target.value)}
            onBlur={handleTodoEdit}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDelete}
          >
            ×
          </button>

          <div
            className={cn('modal overlay', {
              'is-active':
               isTodoLoading
               || isCurrUpdating || isLoading || isCompletedTodosLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
