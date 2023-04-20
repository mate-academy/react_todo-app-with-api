import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const input = useRef<HTMLInputElement>(null);

  const {
    todos,
    setTodos,
    showError,
    setErrorMessage,
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(AppContext);

  const isLoadingState = useMemo(() => (
    loadingTodosIds.includes(id)
  ), [loadingTodosIds]);

  const deleteTodoFromServer = useCallback(async () => {
    try {
      setErrorMessage('');
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(prevTodo => (
        prevTodo.id !== id
      )));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, [loadingTodosIds, todos]);

  const updateTodo = useCallback(async (updatedPart: Partial<Todo>) => {
    try {
      setErrorMessage('');
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      await patchTodo(id, updatedPart);

      setTodos(prevTodos => prevTodos.map(prevTodo => {
        return (prevTodo.id === id)
          ? {
            ...prevTodo,
            ...updatedPart,
          }
          : prevTodo;
      }));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, [loadingTodosIds, todos, newTitle]);

  const updateTitle = useCallback(() => {
    const newTitleTrimmed = newTitle.trim();

    if (newTitleTrimmed) {
      updateTodo({ title: newTitleTrimmed });
      setNewTitle(newTitleTrimmed);
      setIsEditingMode(false);
    } else {
      deleteTodoFromServer();
    }
  }, [newTitle]);

  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.currentTarget.value);
  };

  const handleTitleDoubleClick = () => {
    setIsEditingMode(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  useEffect(() => {
    if (isEditingMode && input.current) {
      input.current.focus();
    }
  }, [isEditingMode]);

  useEffect(() => {
    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditingMode(false);
        setNewTitle(title);
      }
    };

    window.document.addEventListener('keyup', handleKeyup);

    return () => {
      window.document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodo({ completed: !completed })}
        />
      </label>

      {isEditingMode
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleNewTitleChange}
              onBlur={() => updateTitle()}
              ref={input}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleTitleDoubleClick}
            >
              {title}
            </span>

            <button
              aria-label="Remove"
              type="button"
              className="todo__remove"
              onClick={deleteTodoFromServer}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoadingState },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
