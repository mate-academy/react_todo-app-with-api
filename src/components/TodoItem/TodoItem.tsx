import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { removeTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id, userId, title, completed,
  } = todo;

  const {
    todos,
    setTodos,
    handleErrorMessage,
    isLoadingAll,
  } = useContext(TodosContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemoveTodo = () => {
    setIsLoading(true);

    return removeTodo(id)
      .then(() => setTodos(todos.filter(value => value.id !== id)))
      .catch((error) => {
        setTodos(todos);
        handleErrorMessage(ErrorMessage.UNABLE_DELETE);
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const functionUpdateTodo = (updatedTodo: Todo) => {
    setIsLoading(true);

    return updateTodo(updatedTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(element => element.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        handleErrorMessage(ErrorMessage.UNABLE_UPDATE);
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeStatusTodo = () => {
    const newTodo = {
      id,
      title,
      completed: !completed,
      userId,
    };

    functionUpdateTodo(newTodo);
  };

  const handleSubmitTodo = (
    event:
    React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (!changedTitle.trim()) {
      handleRemoveTodo()
        .catch(() => setIsEditing(true));
    }

    if (changedTitle.trim() && changedTitle.trim() !== title) {
      const newTodo = {
        id,
        title: changedTitle.trim(),
        userId,
        completed,
      };

      functionUpdateTodo(newTodo)
        .then(() => setIsEditing(false))
        .catch(() => setIsEditing(true));
    } else {
      setIsEditing(false);
    }
  };

  const handleBackTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setChangedTitle(title);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  return (
    <li
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatusTodo}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            inputRef.current?.focus();
          }}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleRemoveTodo}
        >
          ×
        </button>
      )}

      {isEditing && (
        <form onSubmit={(e) => handleSubmitTodo(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={(e) => setChangedTitle(e.target.value)}
            ref={inputRef}
            onKeyUp={(e) => handleBackTodo(e)}
            onBlur={(e) => handleSubmitTodo(e)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading
            || (isLoadingAll && completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
