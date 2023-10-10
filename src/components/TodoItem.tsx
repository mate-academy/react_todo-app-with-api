import {
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (par: number) => Promise<void>;
  updateTodo: (par: Todo) => Promise<void>;
  searchCompletedTodos: () => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  searchCompletedTodos,
}) => {
  const [checked, setChecked] = useState(todo.completed);
  const [isClicked, setIsClicked] = useState(false);
  const [changedTitle, setChangedTitle] = useState(todo.title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const handleComplete = () => {
    setIsClicked(true);
    setChecked(!checked);
    updateTodo({ ...todo, completed: !todo.completed })
      .then(() => setIsClicked(false));
    searchCompletedTodos();
  };

  const handleTitle = (e: FormEvent) => {
    e.preventDefault();
    const trimmedChandedTitle = changedTitle.trim();

    if (trimmedChandedTitle === changedTitle.trim()) {
      setChangedTitle(trimmedChandedTitle);
    }

    if (!trimmedChandedTitle.length) {
      setIsClicked(true);
      deleteTodo(todo.id)
        .then(() => {
          setIsDoubleClicked(false);
        })
        .catch((error) => {
          setIsDoubleClicked(true);
          throw error;
        })
        .finally(() => {
          setIsClicked(false);
        });
    }

    if (trimmedChandedTitle.length && trimmedChandedTitle !== todo.title) {
      setIsClicked(true);
      updateTodo({ ...todo, title: trimmedChandedTitle })
        .then(() => {
          setIsDoubleClicked(false);
        })
        .catch(() => {
          setIsDoubleClicked(false);
        })
        .finally(() => {
          setIsClicked(false);
        });
    } else if (trimmedChandedTitle === todo.title) {
      setIsDoubleClicked(false);
      setIsClicked(false);
    } else {
      setIsClicked(true);
      setIsDoubleClicked(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isDoubleClicked) {
      inputRef.current.focus();
    }
  }, [isDoubleClicked]);

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={checked}
            onChange={handleComplete}
          />
        </label>

        {isDoubleClicked ? (
          <form onSubmit={handleTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={changedTitle}
              onChange={(e) => setChangedTitle(e.target.value)}
              onBlur={handleTitle}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setIsDoubleClicked(false);
                }
              }}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsDoubleClicked(true);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                setIsClicked(true);
                deleteTodo(todo.id)
                  .finally(() => setIsClicked(false));
              }}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isClicked })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
