import classNames from 'classnames/bind';
import {
  FC, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AppTodoContext } from '../AppTodoContext/AppTodoContext';
import {
  deleteTodo,
  editTodoTitle,
  getTodos,
  toggleTodoStatus,
} from '../../api/todos';
import { ErrorType } from '../Error/Error.types';
import { USER_ID } from '../../react-app-env';

interface Props {
  todo: Todo,
  isItTempTodo?: boolean,
}

export const TodoItem: FC<Props> = (
  { todo, isItTempTodo },
) => {
  const {
    todos,
    processingTodoIDs,
    setErrorMessage,
    setProcessingTodoIDs,
    setTodos,
    setVisibleTodos,
  } = useContext(AppTodoContext);

  const { title, completed, id } = todo;

  const [editValue, setEditValue] = useState(title);
  const [isEditAvailable, setIsEditAvailable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemoveButton = async () => {
    setProcessingTodoIDs(prevDelTodoIDs => [...prevDelTodoIDs, todo.id]);

    try {
      await deleteTodo(todo.id);
      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorType.DeleteTodoError);
    } finally {
      setProcessingTodoIDs(
        prevDelTodoIDs => prevDelTodoIDs.filter(delID => delID !== todo.id),
      );
      setVisibleTodos(prevVisTodos => (
        prevVisTodos.filter(prevTodo => prevTodo.id !== todo.id)
      ));
    }
  };

  const handleToggleStatus = async () => {
    setProcessingTodoIDs(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await toggleTodoStatus(todo);
      const prevTodoIndex = todos.findIndex(
        prevTodo => prevTodo.id === todo.id,
      );

      setVisibleTodos(prevTodos => {
        const updatedTodos = [...prevTodos];

        updatedTodos[prevTodoIndex] = updatedTodo;

        return updatedTodos;
      });

      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorType.UpdateTodoError);
    } finally {
      setProcessingTodoIDs(prev => prev.filter(prevID => prevID !== todo.id));
    }
  };

  const handleEditSubmit = async () => {
    setProcessingTodoIDs([id]);

    if (editValue === title) {
      setProcessingTodoIDs([]);
      setIsEditAvailable(false);

      return;
    }

    if (editValue.trim() === '') {
      handleRemoveButton();
      setIsEditAvailable(false);

      return;
    }

    try {
      const updatedTodo = await editTodoTitle(id, editValue);
      const oldTodoIndex = todos.findIndex(prevTodo => prevTodo.id === id);

      setTodos(prevTodos => {
        prevTodos.splice(oldTodoIndex, 1, updatedTodo);

        return prevTodos;
      });
      setVisibleTodos(prevTodos => {
        prevTodos.splice(oldTodoIndex, 1, updatedTodo);

        return prevTodos;
      });
    } catch {
      setErrorMessage(ErrorType.UpdateTodoError);
    } finally {
      setIsEditAvailable(false);
      setProcessingTodoIDs([]);
    }
  };

  const handleKeyUpAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditAvailable(false);
    }
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEditAvailable]);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggleStatus}
        />
      </label>

      {isEditAvailable
        ? (
          <form
            className="todo__title"
            onSubmit={
              (event) => {
                event.preventDefault();
                handleEditSubmit();
              }
            }
          >
            <input
              className="todo__title"
              ref={inputRef}
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              onBlur={handleEditSubmit}
              onKeyUp={handleKeyUpAction}
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => {
              setIsEditAvailable(true);
            }}
          >
            {title}
          </span>
        )}

      {!isEditAvailable && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            handleRemoveButton();
          }}
        >
          ×
        </button>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': processingTodoIDs.includes(id) },
        { 'is-active': isItTempTodo },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
