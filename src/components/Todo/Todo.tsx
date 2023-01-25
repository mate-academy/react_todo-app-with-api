import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { deleteTodo, patchTodo } from '../../api/todos';
import { Error } from '../../types';
import { ITodo } from '../../types/ITodo';
import { AppContext } from '../AppProvider/AppProvider';

type Props = {
  todo: ITodo
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState(todo.title);

  const {
    setError,
    setTodos,
    todos,
    isLoadingMany,
    isDeleting,
  } = useContext(AppContext);

  const titleField = useRef<HTMLInputElement>(null);

  const areAllChecked = todos.every(({ completed }) => completed);
  const shouldLoad = !todo.completed || areAllChecked;

  const isActive = isLoading
    || todo.id === 0 // temp todo
    || (isLoadingMany && shouldLoad)
    || (isDeleting && todo.completed);

  useEffect(() => {
    const cancelEdit = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setTitle(visibleTitle);
      }
    };

    window.addEventListener('keydown', cancelEdit);

    return () => {
      window.removeEventListener('keydown', cancelEdit);
    };
  }, []);

  useEffect(() => {
    titleField.current?.focus();
  }, [isEditing]);

  const onDelete = async () => {
    setIsLoading(true);
    const filteredTodos = todos.filter(({ id }) => id !== todo.id);

    try {
      await deleteTodo(todo.id);
      setTodos(filteredTodos);
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!todo.title) {
      onDelete();
    }
  });

  const updateTodo = async (newProps: Partial<ITodo>) => {
    setIsLoading(true);
    setVisibleTitle(title);

    try {
      await patchTodo(todo.id, newProps);
      setTodos(todos.map(mappedTodo => (
        mappedTodo.id === todo.id
          ? { ...mappedTodo, ...newProps }
          : mappedTodo
      )));
    } catch {
      setError(Error.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const onCheck = () => {
    updateTodo({
      completed: !todo.completed,
    });
  };

  const renameTodo = () => {
    if (title !== todo.title) {
      updateTodo({ title });
    }

    setIsEditing(false);
  };

  // PATCH todo.title
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    renameTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={onCheck}
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={onSubmit}
            onBlur={renameTodo}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              ref={titleField}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {visibleTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
