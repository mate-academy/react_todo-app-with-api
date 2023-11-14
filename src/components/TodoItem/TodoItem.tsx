import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, updateTodo } from '../../api/todos';
import { DispatchContext } from '../../Context/Store';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const dispatch = useContext(DispatchContext);
  const refUpdate = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEdited(false);
        setNewTitle(todo.title);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [todo.title]);

  useEffect(() => {
    if (isEdited) {
      refUpdate.current?.focus();
    }
  }, [isEdited]);

  const TodoDeleteButton = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => dispatch({
        type: 'deleteTodo',
        payload: todo,
      }))
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableDeleteTodo,
      }))
      .finally(() => setIsLoading(false));
  };

  const handleChangeCompleted = () => {
    setIsLoading(true);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(newTodo)
      .then(() => dispatch({
        type: 'updateTodo',
        payload: newTodo,
      }))
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableUpdateTodo,
      }))
      .finally(() => setIsLoading(false));
  };

  const handleChangeTitle = (event: React.FormEvent) => {
    event.preventDefault();
    const preparedTitle = newTitle.trim();

    if (preparedTitle === todo.title) {
      setIsEdited(false);

      return;
    }

    if (!preparedTitle) {
      TodoDeleteButton();

      return;
    }

    const newTodo = {
      ...todo,
      title: preparedTitle,
    };

    setIsLoading(true);

    updateTodo(newTodo)
      .then(() => {
        dispatch({
          type: 'updateTodo',
          payload: newTodo,
        });
        setIsEdited(false);
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: Error.UnableUpdateTodo,
        });
        setNewTitle(preparedTitle);
      })
      .finally(() => setIsLoading(false));
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
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompleted}
        />
      </label>
      {!isEdited ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={TodoDeleteButton}
          >
            ×
          </button>
        </>
      )
        : (
          <form onSubmit={handleChangeTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={refUpdate}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleChangeTitle}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': todo.id === 0 || isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
