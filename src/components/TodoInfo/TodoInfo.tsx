import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { patchTodo, removeTodo } from '../../api/todos';
import { Errors } from '../../utils/enums';

interface Props {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError:(error:Errors) => void;
  onUpdate:(Todo: Todo) => void;
  tempTodoId?: number;
  isChanging: boolean;
  setIsChanging: (boolean: boolean) => void;
}

export const TodoInfo:FC<Props> = ({
  todo,
  setTodos,
  setError,
  onUpdate,
  tempTodoId,
  isChanging,
  setIsChanging,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);
  const [editingQuery, setEditingQuery] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleTodoDelete = () => {
    setIsLoading(true);

    removeTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((currentTodo) => currentTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError(Errors.Delete);
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
      setError(Errors.Update);
    }

    setIsLoading(false);
  }, [completed]);

  const handleTodoEscape = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    }, [],
  );

  const handleSubmit = useCallback(async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const todoData = {
      ...todo,
      title: editingQuery.trim(),
    };

    if (!editingQuery) {
      handleTodoDelete();
    }

    setIsChanging(true);
    try {
      setIsEditing(true);
      setEditingQuery(title);
      const updatedTodo = await patchTodo(id, todoData);

      onUpdate(updatedTodo);
    } catch {
      setError(Errors.Update);
    }

    setIsLoading(false);
    setIsEditing(false);
    setIsChanging(false);
  }, [editingQuery]);

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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingQuery}
            onChange={(event) => setEditingQuery(event.target.value)}
            onKeyUp={handleTodoEscape}
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
