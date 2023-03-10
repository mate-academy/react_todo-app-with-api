import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoaderVisible: boolean;
  onDelete: (todoId: number) => void;
  handleChangeTitle: (todo: Todo, newTitle: string) => void;
  handleChangeStatus: (todo: Todo) => void;
  setUpdatingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isLoaderVisible,
  handleChangeTitle,
  setUpdatingTodoIds,
  handleChangeStatus,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todo?.completed) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [isLoaderVisible]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsEditing(false);
    event.preventDefault();

    if (query === todo.title) {
      return;
    }

    if (!query.trim()) {
      onDelete(todo.id);

      return;
    }

    handleChangeTitle(todo, query);
  };

  const toggleStatus = () => {
    setIsCompleted(!isCompleted);
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);
    handleChangeStatus(todo);
  };

  const todoContent = useMemo(() => (
    isEditing
      ? (
        <form
          onSubmit={onFormSubmit}
          onBlur={onFormSubmit}
        >
          <input
            type="text"
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </form>
      ) : (
        <>
          <span>
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )
  ), [isEditing, query, onDelete]);

  return (
    <li className={classNames('todo', {
      completed: isCompleted,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={toggleStatus}
        />
      </label>

      <div
        className="todo__title"
        onDoubleClick={() => {
          setIsEditing(true);
        }}
      >
        {todoContent}
      </div>

      <div
        className={classNames(
          'modal',
          'overlay', {
            'is-active': isLoaderVisible,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
