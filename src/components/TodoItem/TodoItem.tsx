/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { editTodo } from '../../api/todos';
import callError from '../../utils/callError';
import { MainContext } from '../../ContextProvider/ContextProvider';
import { TodoDelete } from './utils';

type TodoProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoProps> = ({ todo }) => {
  const context = useContext(MainContext);
  const { setTodos, setError, loadingIds } = context;

  const { id, title, completed } = todo;

  const [todoState, setTodoState] = useState({
    isTodoEditing: false,
    editedValue: title,
    isLoading: loadingIds.some(x => x === id),
  });

  const { isTodoEditing, editedValue, isLoading } = todoState;
  const newTitle = editedValue.trim();

  const focusedTodo = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTodoState(prev => ({
      ...prev,
      isLoading: loadingIds.some(x => x === id),
    }));
  }, [loadingIds, id]);

  useEffect(() => {
    if (focusedTodo.current) {
      if (isTodoEditing) {
        focusedTodo.current.focus();
      } else {
        focusedTodo.current.blur();
      }
    }
  }, [isTodoEditing]);

  useEffect(() => {
    const handleEscapeClick = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTodoState({
          ...todoState,
          isTodoEditing: false,
          editedValue: title,
        });
      }
    };

    if (isTodoEditing) {
      document.addEventListener('keydown', handleEscapeClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [todoState, isTodoEditing, title]);

  useEffect(() => {
    const cleanInputFocus = (event: MouseEvent) => {
      event.preventDefault();

      const element = event.target as HTMLElement;

      if (element.dataset.cy !== 'TodoTitleField') {
        setTodoState({ ...todoState, isTodoEditing: false });
      }
    };

    if (isTodoEditing) {
      document.addEventListener('click', cleanInputFocus);
    }

    return () => {
      document.removeEventListener('click', cleanInputFocus);
    };
  }, [todoState, isTodoEditing]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      TodoDelete(id, setTodos, setError, setTodoState);
    },
    [id, setError, setTodos],
  );

  const handleCompleteTodo = useCallback(() => {
    const newStatus = !completed;

    setTodoState(prev => ({
      ...prev,
      completed: newStatus,
      isLoading: true,
    }));

    editTodo(id, { completed: newStatus })
      .then((res: Todo) => {
        setTodos((prev: Todo[]) =>
          prev.map(task => (task.id === id ? res : task)),
        );
      })
      .catch(() => {
        setTodoState(prev => ({ ...prev, completed: completed }));
        callError(setError, 'update');
      })
      .finally(() => {
        setTodoState(prev => ({ ...prev, isLoading: false }));
      });
  }, [setTodoState, id, completed, setTodos, setError]);

  const saveTodoTitleChanges = useCallback(() => {
    if (title === newTitle) {
      setTodoState(prev => ({ ...prev, isTodoEditing: false }));

      return;
    }

    setTodoState(prev => ({ ...prev, isLoading: true }));

    editTodo(id, { title: newTitle })
      .then((res: Todo) => {
        setTodos((prev: Todo[]) =>
          prev.map(task => (task.id === id ? res : task)),
        );
        setTodoState(prev => ({
          ...prev,
          isLoading: false,
          isTodoEditing: false,
        }));
      })
      .catch(() => {
        callError(setError, 'update');
        setTodoState(prev => ({
          ...prev,
          isLoading: false,
        }));
      });
  }, [setTodoState, id, title, newTitle, setTodos, setError]);

  const applyTodoUpdate = useCallback(() => {
    if (newTitle.length === 0) {
      TodoDelete(id, setTodos, setError, setTodoState);

      return;
    }

    saveTodoTitleChanges();
  }, [saveTodoTitleChanges, id, newTitle.length, setTodos, setError]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompleteTodo}
        />
      </label>

      {todoState.isTodoEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            applyTodoUpdate();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            ref={focusedTodo}
            onBlur={() => applyTodoUpdate()}
            onChange={e =>
              setTodoState({ ...todoState, editedValue: e.target.value })
            }
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() =>
            setTodoState({ ...todoState, isTodoEditing: true })
          }
        >
          {newTitle}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isTodoEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteClick}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
