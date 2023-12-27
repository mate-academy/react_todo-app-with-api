import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { DispatchContext } from '../../Store';
import { TodoLoader } from '../TodoLoader';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
};
export const TodoItem: React.FC<Props> = React.memo(({ todo, isLoading }) => {
  const { id, title, completed } = todo;
  const dispatch = useContext(DispatchContext);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.UpdateTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleDeleteTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.DeleteTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleDeleteTodo = useCallback(async () => {
    dispatch({ type: 'addLoading', payload: todo });

    try {
      await deleteTodo(id);
      dispatch({ type: 'deleteTodo', payload: todo });
    } catch (error) {
      handleDeleteTodoError();
    } finally {
      dispatch({ type: 'deleteLoading', payload: todo });
    }
  }, [dispatch, id, todo, handleDeleteTodoError]);

  const handleToggleTodo = useCallback(async () => {
    dispatch({ type: 'addLoading', payload: todo });

    try {
      await updateTodo(id, { completed: !completed });
      dispatch({ type: 'toggleTodo', payload: todo });
    } catch (error) {
      handleUpdateTodoError();
    } finally {
      dispatch({ type: 'deleteLoading', payload: todo });
    }
  }, [dispatch, id, completed, todo, handleUpdateTodoError]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = editedTitle.trim();

    if (title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      dispatch({ type: 'addLoading', payload: todo });

      try {
        await deleteTodo(id);
        dispatch({ type: 'deleteTodo', payload: todo });
        setIsEditing(false);
      } catch (error) {
        handleDeleteTodoError();
      } finally {
        dispatch({ type: 'deleteLoading', payload: todo });
      }
    } else {
      dispatch({ type: 'addLoading', payload: todo });

      try {
        await updateTodo(id, { title: trimmedTitle });
        dispatch({
          type: 'editTodo',
          payload: {
            ...todo,
            title: trimmedTitle,
          },
        });
        setIsEditing(false);
      } catch (error) {
        handleUpdateTodoError();
      } finally {
        dispatch({ type: 'deleteLoading', payload: todo });
      }
    }
  }, [
    dispatch,
    todo,
    id,
    title,
    editedTitle,
    setIsEditing,
    handleUpdateTodoError,
    handleDeleteTodoError,
  ]);

  const handleTitleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  }, [setEditedTitle]);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={completed}
          data-cy="TodoStatus"
          className="todo__status"
          onChange={handleToggleTodo}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            value={editedTitle}
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleTitleChange}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <TodoLoader isLoading={isLoading} />
    </div>
  );
});
