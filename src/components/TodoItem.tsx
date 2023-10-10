import {
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { MakeTodosCompleted, Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (par: number) => Promise<void>;
  updateTodo: (par: Todo) => Promise<void>;
  searchCompletedTodos: () => void;
  makeTodosComplete: MakeTodosCompleted;
  clearCompleted: boolean;
  setClearCompleted: (par: boolean) => void;
  setMakeTodosComplete: (par: MakeTodosCompleted) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  searchCompletedTodos,
  makeTodosComplete,
  clearCompleted,
  setClearCompleted,
  setMakeTodosComplete,
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

  // eslint-disable-next-line
  useEffect(() => {
    if (makeTodosComplete === MakeTodosCompleted.do && !checked) {
      setIsClicked(true);
      setChecked(true);
      updateTodo({ ...todo, completed: true })
        .then(() => setIsClicked(false))
        .finally(() => setMakeTodosComplete(MakeTodosCompleted.begin));
    }

    if (makeTodosComplete === MakeTodosCompleted.not && checked) {
      setIsClicked(true);
      setChecked(false);
      updateTodo({ ...todo, completed: false })
        .then(() => setIsClicked(false))
        .finally(() => setMakeTodosComplete(MakeTodosCompleted.begin));
    }
  }, [makeTodosComplete]);

  useEffect(() => {
    if (checked && clearCompleted) {
      setIsClicked(true);
      deleteTodo(todo.id)
        .finally(() => {
          setIsClicked(false);
          setClearCompleted(false);
        });
    }
  }, [clearCompleted, checked, deleteTodo, setClearCompleted, todo.id]);

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
                  setChangedTitle(todo.title);
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
