import classNames from 'classnames';
import { useRef, useState } from 'react';
import { patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  deleteTodoHandler: (userId: number) => void
  isLoading: number[]
  updateStatusHandler: (todo: Todo) => void
  setTodos: (todos: Todo[]) => void
  toggleToCompleted: () => void
  setError: (error: string) => void
  todo: Todo

};

export const TodoRow: React.FC<Props> = ({
  todo,
  deleteTodoHandler,
  updateStatusHandler,
  isLoading,
  setTodos,
  todos,
  setError,

}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isLoadingLocale, setIsLoadingLocale] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const changeTitleHandler = () => {
    setIsLoadingLocale(true);

    if (editTitle === '') {
      deleteTodoHandler(todo.id);
      setIsEdited(false);
      setIsLoadingLocale(false);

      return;
    }

    if (editTitle === todo.title) {
      setIsEdited(false);
      setIsLoadingLocale(false);

      return;
    }

    patchTodo(todo, { title: editTitle.trim() })
      .then(() => {
        setTodos(todos.map(item => {
          if (item.id === todo.id) {
            return { ...todo, title: editTitle.trim() };
          }

          return item;
        }));
        setIsEdited(false);
      }).catch(() => {
        setError('Unable to update a Todo');
        if (inputRef.current !== null) {
          inputRef.current.focus();
        }

        setTimeout(() => {
          setError('');
        }, 3000);
      }).finally(() => {
        setIsLoadingLocale(false);
      });
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEdited(false);
    }
  };

  window.addEventListener('keydown', handleEscapeKey);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateStatusHandler(todo)}
        />
      </label>

      {isEdited && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changeTitleHandler();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            ref={inputRef}
            onBlur={(e) => {
              e.preventDefault();
              changeTitleHandler();
            }}
          />
        </form>
      )}

      {!isEdited && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEdited(true);
            setEditTitle(todo.title);
          }}
        >
          {todo.title || editTitle}

        </span>
      )}

      {!isEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodoHandler(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading.includes(todo.id) || isLoadingLocale },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
