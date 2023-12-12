import React, {
  useContext,
  useEffect,
  useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    handleSetError,
    setTempUpdating,
    tempUpdating,
  } = useContext(TodosContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('current' in titleField) {
      titleField.current?.focus();
    }
  }, [isUpdating]);

  const { id, title, completed } = todo;

  const handleDeleteTodo = async () => {
    handleSetError(ErrorMessage.NOT_ERROR);

    try {
      setTempUpdating(prev => [...prev, id]);

      await deleteTodo(USER_ID, id);

      setTodos(todos.filter(currTodo => currTodo.id !== id));
    } catch {
      handleSetError(ErrorMessage.ON_DELETE);
    } finally {
      setTempUpdating([0]);
    }
  };

  const handleUpdateStatus = async (newValue: object) => {
    handleSetError(ErrorMessage.NOT_ERROR);

    try {
      setTempUpdating(prev => [...prev, id]);

      const updatedTodo: Todo = await updateTodo(USER_ID, id, newValue);
      const copyTodo = [...todos];

      const indexOfUpdTodo = copyTodo
        .findIndex(curr => curr.id === updatedTodo.id);

      copyTodo.splice(indexOfUpdTodo, 1, updatedTodo);

      setTodos(copyTodo);
    } catch {
      handleSetError(ErrorMessage.ON_UPDATE);
    } finally {
      setTempUpdating([0]);
    }
  };

  const handleDoubleClick = () => {
    setIsUpdating(true);
  };

  const handleCancelChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.code === 'Escape') {
      setQuery(title);
      setIsUpdating(false);
    }
  };

  const changeTodoTitle = () => {
    if (query.trim() === title) {
      setIsUpdating(false);
      setQuery(query.trim());

      return;
    }

    if (!query.trim()) {
      handleDeleteTodo();
      setIsUpdating(false);

      return;
    }

    handleUpdateStatus({ title: query });
    setIsUpdating(false);
    setQuery(query.trim());
  };

  const handleChangeTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeTodoTitle();
  };

  const hadnleOnBlur = () => {
    setIsUpdating(false);

    changeTodoTitle();
  };

  return (
    <div
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
          onClick={() => handleUpdateStatus({ completed: !completed })}
        />
      </label>
      {isUpdating ? (
        <form
          onSubmit={handleChangeTodo}
        >
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={hadnleOnBlur}
            onKeyUp={handleCancelChanges}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': tempUpdating.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
