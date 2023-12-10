import {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { DispatchContext, StateContext } from './TodosProvider';
import { deleteTodo, updateTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { LoadingStatus } from '../types/LoadingStatus';
import { TEMP_TODO_ID } from '../constants/tempTodoId';

type Props = {
  todo: Todo,
};

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const {
    completed,
    id,
    title,
    userId,
  } = todo;

  const {
    todos,
    shouldLoading,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(!todos.find(t => t.id === id));
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    try {
      const updatedTodo = await updateTodo({
        id,
        title,
        completed: e.target.checked,
        userId,
      });

      dispatch({
        type: 'updateTodo',
        payload: updatedTodo,
      });

      setIsLoading(false);
    } catch (error) {
      dispatch({
        type: 'error',
        payload: ErrorMessage.Updating,
      });
      setIsLoading(false);
    }
  };

  const deleteCurrentTodo = async () => {
    setIsLoading(true);
    try {
      await deleteTodo(id);

      dispatch({
        type: 'deleteTodo',
        payload: id,
      });
      setIsUpdatingTitle(false);
    } catch (error) {
      dispatch({
        type: 'error',
        payload: ErrorMessage.Deleting,
      });
      setIsUpdatingTitle(false);
      setNewTitle(title);
    }
  };

  const handleNewTitleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTitle.trim() === title) {
      setIsUpdatingTitle(false);

      return;
    }

    if (!newTitle.trim()) {
      deleteCurrentTodo();

      return;
    }

    setIsLoading(true);

    const updatedTodo = {
      ...todo,
      title: newTitle.trim(),
    };

    try {
      await updateTodo(updatedTodo);
      dispatch({
        type: 'updateTodo',
        payload: updatedTodo,
      });
      setIsLoading(false);
      setIsUpdatingTitle(false);
    } catch (error) {
      setIsLoading(false);

      if (isUpdatingTitle && inputRef.current) {
        inputRef.current.focus();
      }

      dispatch({
        type: 'error',
        payload: ErrorMessage.Updating,
      });
    }
  };

  const changeTitleOnBlur = async () => {
    setIsLoading(true);

    if (!newTitle.trim()) {
      deleteCurrentTodo();

      return;
    }

    try {
      const updatedTodo = {
        ...todo,
        title: newTitle.trim(),
      };

      await updateTodo(updatedTodo);
      dispatch({
        type: 'updateTodo',
        payload: updatedTodo,
      });

      setIsLoading(false);
      setIsUpdatingTitle(false);
    } catch (error) {
      setIsLoading(false);

      if (isUpdatingTitle && inputRef.current) {
        inputRef.current.focus();
      }

      dispatch({
        type: 'error',
        payload: ErrorMessage.Updating,
      });
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsUpdatingTitle(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    switch (true) {
      case shouldLoading === LoadingStatus.Completed && completed:
        setIsLoading(true);

        break;

      case shouldLoading === LoadingStatus.All:
        setIsLoading(true);

        break;

      case shouldLoading === LoadingStatus.Current && id === TEMP_TODO_ID:
        setIsLoading(true);

        break;

      case shouldLoading === LoadingStatus.None:
        setIsLoading(false);

        break;

      default:
        break;
    }
  }, [id, completed, shouldLoading]);

  useEffect(() => {
    if (isUpdatingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdatingTitle]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleChecked}
        />
      </label>

      {
        !isUpdatingTitle
          ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsUpdatingTitle(true)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={deleteCurrentTodo}
              >
                ×
              </button>
            </>
          )
          : (
            <form
              onSubmit={handleNewTitleSubmit}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onBlur={changeTitleOnBlur}
                onKeyUp={handleKeyUp}
                ref={inputRef}
              />
            </form>
          )
      }
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
