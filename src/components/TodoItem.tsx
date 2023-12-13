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
    newTodoInputRef,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(!todos.find(t => t.id === id));
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const updateTitleRef = useRef<HTMLInputElement | null>(null);

  const toggleChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const updatedTodo = await updateTodo({
        id,
        title,
        completed: e.target.checked,
        userId,
      });

      dispatch({
        type: 'updateTodo',
        payload: { todo: updatedTodo },
      });
    } catch (error) {
      dispatch({
        type: 'error',
        payload: { error: ErrorMessage.Updating },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCurrentTodo = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(id);

      dispatch({
        type: 'deleteTodo',
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: 'error',
        payload: { error: ErrorMessage.Deleting },
      });
    } finally {
      setIsUpdatingTitle(false);
      setIsLoading(false);
      newTodoInputRef?.focus();
    }
  };

  const updateNewTitle = async () => {
    try {
      setIsLoading(true);

      if (newTitle.trim() === title) {
        setIsUpdatingTitle(false);
        setIsLoading(false);

        return;
      }

      if (!newTitle.trim()) {
        try {
          await deleteTodo(id);

          dispatch({
            type: 'deleteTodo',
            payload: id,
          });
        } catch (error) {
          if (isUpdatingTitle && updateTitleRef.current) {
            updateTitleRef.current.focus();
          }

          dispatch({
            type: 'error',
            payload: { error: ErrorMessage.Deleting },
          });
        } finally {
          setIsLoading(false);
        }

        return;
      }

      const updatedTodo = {
        ...todo,
        title: newTitle.trim(),
      };

      await updateTodo(updatedTodo);

      dispatch({
        type: 'updateTodo',
        payload: { todo: updatedTodo },
      });
      setIsUpdatingTitle(false);
    } catch (error) {
      if (isUpdatingTitle && updateTitleRef.current) {
        updateTitleRef.current.focus();
      }

      dispatch({
        type: 'error',
        payload: { error: ErrorMessage.Updating },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateNewTitle();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsUpdatingTitle(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    switch (true) {
      case id === TEMP_TODO_ID:
        setIsLoading(true);

        break;

      case shouldLoading === LoadingStatus.All:
        setIsLoading(true);

        break;

      case shouldLoading === LoadingStatus.None:
        setIsLoading(false);

        break;

      default:
        break;
    }
  }, [id, shouldLoading]);

  useEffect(() => {
    if (isUpdatingTitle) {
      updateTitleRef.current?.focus();
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
                onDoubleClick={() => {
                  setIsUpdatingTitle(true);
                }}
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
                onBlur={updateNewTitle}
                onKeyUp={handleKeyUp}
                ref={updateTitleRef}
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
