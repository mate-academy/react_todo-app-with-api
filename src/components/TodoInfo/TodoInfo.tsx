import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { patchTodo, removeTodo } from '../../api/todos';
import { Errors } from '../../utils/enums';

interface Props {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onError:(error:Errors) => void;
  onUpdate:(Todo: Todo) => void;
  tempTodoId?: number;
  isChanging: boolean;
}

export const TodoInfo:FC<Props> = ({
  todo,
  setTodos,
  onError,
  onUpdate,
  tempTodoId,
  isChanging,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);
  const [editingQuery, setEditingQuery] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTodoDelete = () => {
    setIsLoading(true);

    removeTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((currentTodo) => currentTodo.id !== todo.id);
        });
      })
      .catch(() => {
        onError(Errors.Delete);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTodoUpdate = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    event?.preventDefault();

    const todoData = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      setIsLoading(true);

      const updatedTodo = await patchTodo(id, todoData);

      onUpdate(updatedTodo);
    } catch {
      onError(Errors.Update);
    }

    setIsLoading(false);
  }, [completed]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, id]);

  const handleTodoEscape = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  }, []);

  const handleSubmit = useCallback(async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!editingQuery.trim()) {
      handleTodoDelete();

      return;
    }

    if (editingQuery.trim() === title) {
      setIsEditing(false);

      return;
    }

    const todoData = {
      ...todo,
      title: editingQuery,
    };

    try {
      setIsEditing(true);
      setIsLoading(true);
      const updatedTodo = await patchTodo(id, todoData);

      onUpdate(updatedTodo);
    } catch {
      onError(Errors.Update);
    }

    setIsLoading(false);
    setIsEditing(false);
  }, [title, editingQuery]);

  return (
    <div
      className={classNames('todo',
        { completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoUpdate}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingQuery}
            onChange={(event) => setEditingQuery(event.target.value)}
            onKeyUp={handleTodoEscape}
            ref={inputRef}
          />
        </form>
      )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
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
          'is-active': isLoading || isChanging,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
