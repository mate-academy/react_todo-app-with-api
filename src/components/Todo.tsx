import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { remove, updatingData } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/Errors';

interface Props {
  completed: boolean,
  title: string;
  id: number;
  setError: (value: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todos: Todo[],
  setSelectedTodoId: (value: number) => void,
  selectedTodoId: number | null,
}

export const TodoInfo: React.FC<Props> = ({
  completed,
  title,
  id,
  setTodos,
  setError,
  todos,
  setSelectedTodoId,
  selectedTodoId,
}) => {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClick]);

  const removeTodo = useCallback(async (removeId: number) => {
    setSelectedTodoId(removeId);
    try {
      await remove(removeId);

      setTodos((state: Todo[]) => [...state]
        .filter(todo => todo.id !== removeId));
    } catch (errorFromServer) {
      setError(ErrorMessage.DeleteError);
    } finally {
      setSelectedTodoId(0);
    }
  }, [id]);

  const handlerCheck = useCallback(async (updateId: number) => {
    setSelectedTodoId(updateId);
    try {
      const currentTodo = todos.find(todo => todo.id === updateId);
      const upDate = await updatingData(
        updateId,
        { completed: !currentTodo?.completed },
      );

      setTodos((state: Todo[]) => [...state].map(todo => {
        if (todo.id === updateId) {
          return ({
            ...upDate,
          });
        }

        return todo;
      }));
    } catch (errorFromServer) {
      setError(ErrorMessage.UpdateError);
    } finally {
      setSelectedTodoId(0);
    }
  }, [id, completed]);

  const handlerInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  }, []);

  const escFunction = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsDoubleClick(false);
    }
  }, ['keydown']);

  const saveData = useCallback(async () => {
    if (newTitle.trim().length === 0) {
      removeTodo(id);
    } else {
      setSelectedTodoId(id);
      try {
        const upDate = await updatingData(id, { title: newTitle });

        setTodos((state: Todo[]) => [...state].map(todo => {
          if (todo.id === id) {
            return ({
              ...upDate,
            });
          }

          return todo;
        }));
      } catch (errorFromServer) {
        setError(ErrorMessage.UpdateError);
      } finally {
        setSelectedTodoId(0);
        setIsDoubleClick(false);
      }
    }
  }, [newTitle, isDoubleClick]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveData();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handlerCheck(id)}
        />
      </label>

      {isDoubleClick && (
        <form
          onSubmit={onSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={handlerInput}
            onBlur={saveData}
            ref={newTodoField}
            onKeyDown={escFunction}
          />
        </form>
      )}

      {!isDoubleClick && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsDoubleClick(true)}
        >
          {title}
        </span>
      )}
      {!isDoubleClick && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': selectedTodoId === id,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
