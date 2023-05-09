import classNames from 'classnames';
import {
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useTodoContext } from '../../context/TodoContext';
import { Todo, TodoUpdate } from '../../types/Todo';

interface Props {
  todo: Todo;

  isPermanentlyLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isPermanentlyLoading }) => {
  const { todoIdsInUpdating, setTodos, setError } = useTodoContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const [inputTitleValue, setInputTitleValue] = useState(todo.title);

  const isCurrentTodoInUpdating = todoIdsInUpdating.includes(todo.id);

  const handleTodoDelete = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((currentTodo) => currentTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTodoEdit = (data: TodoUpdate) => {
    setIsLoading(true);

    updateTodo(todo.id, data)
      .then((updatedTodo: Todo) => {
        setTodos((prevTodos) => {
          const prevTodosCopy = [...prevTodos];

          const indexOfUpdatedTodo = prevTodosCopy.findIndex(
            (currentTodo) => currentTodo.id === updatedTodo.id,
          );

          prevTodosCopy[indexOfUpdatedTodo] = updatedTodo;

          return prevTodosCopy;
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTitleEdit = () => {
    setIsTitleEditing(false);

    if (inputTitleValue === todo.title) {
      return;
    }

    if (inputTitleValue) {
      handleTodoEdit({ title: inputTitleValue });
    } else {
      handleTodoDelete();
    }
  };

  const handleTitleEditSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    handleTitleEdit();
  };

  useEffect(() => {
    if (isTitleEditing) {
      inputRef.current?.focus();
    }
  }, [isTitleEditing]);

  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInputTitleValue(todo.title);
        setIsTitleEditing(false);
      }
    };

    document.addEventListener('keyup', handleEscapePress);

    return () => {
      document.removeEventListener('keyup', handleEscapePress);
    };
  }, [todo]);

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(event) => {
            handleTodoEdit({ completed: event.target.checked });
          }}
          ref={inputRef}
        />
      </label>

      {isTitleEditing ? (
        <form onSubmit={handleTitleEditSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={inputTitleValue}
            onChange={(event) => setInputTitleValue(event.target.value)}
            onBlur={handleTitleEdit}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsTitleEditing(true)}
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
        </>
      )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active':
            isPermanentlyLoading || isLoading || isCurrentTodoInUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
