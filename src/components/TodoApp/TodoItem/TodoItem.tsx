import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import './TodoItem.scss';

import * as todoService from '../../../api/todos';

import {
  DispatchContext,
  StateContext,
} from '../../../TodoStore';
import { Todo } from '../../../types/Todo';
import { actionCreator } from '../../../reducer';
import { TodoError } from '../../../types/TodoError';

type Props = {
  todo: Todo,
};

type UpdatingTodoEvent =
| React.FocusEvent<HTMLInputElement>
| React.FormEvent<HTMLFormElement>
| React.ChangeEvent<HTMLInputElement>;

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const dispatch = useContext(DispatchContext);
  const {
    loadingItemsId,
    isSubmitting,
    isUpdating,
    isDeleting,
  } = useContext(StateContext);

  const editingTodo = useRef<HTMLInputElement>(null);
  const isLoader = loadingItemsId.includes(todo.id)
    && (isSubmitting || isUpdating || isDeleting);

  useEffect(() => {
    if (editingTodo.current && isLocalEditing) {
      editingTodo.current.focus();
    }
  }, [isLocalEditing]);

  const deleteTodo = useCallback(() => {
    dispatch(actionCreator.addLoadingItemId(todo.id));
    dispatch(actionCreator.toggleDeleting());
    dispatch(actionCreator.clearError());
    todoService.deleteTodo(todo.id)
      .then(() => {
        dispatch(actionCreator.updateTodos({ delete: todo.id }));
      })
      .catch(error => {
        dispatch(actionCreator.addError(TodoError.ErrorDelete));
        throw error;
      })
      .then(() => {
        setIsLocalEditing(false);
        dispatch(actionCreator.toggleEditing(false));
      })
      .finally(() => {
        dispatch(actionCreator.toggleDeleting());
        dispatch(actionCreator.clearLoadingItemsId());
      });
  }, [dispatch, todo.id]);

  const updateTodo = useCallback(
    (event: UpdatingTodoEvent) => {
      const updatedTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: todo.completed,
      };

      switch (event.type) {
        case 'change':
          updatedTodo.completed = !todo.completed;
          break;

        case 'blur':
        case 'submit':
          updatedTodo.title = newTitle.trim();
          break;

        default:
          break;
      }

      dispatch(actionCreator.addLoadingItemId(todo.id));
      dispatch(actionCreator.toggleUpdating());
      dispatch(actionCreator.clearError());
      todoService.updateTodo(updatedTodo)
        .then(newTodo => {
          dispatch(actionCreator.updateTodos({ update: newTodo }));
        })
        .catch(error => {
          dispatch(actionCreator.addError(TodoError.ErrorUpdate));
          throw error;
        })
        .then(() => setIsLocalEditing(false))
        .finally(() => {
          dispatch(actionCreator.toggleUpdating());
          dispatch(actionCreator.clearLoadingItemsId());
        });
    }, [dispatch, newTitle, todo.completed, todo.id, todo.title, todo.userId],
  );

  const handleDoubleClick = () => {
    dispatch(actionCreator.toggleEditing(true));
    setIsLocalEditing(true);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsLocalEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleUpdateSubmit = (event: UpdatingTodoEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) {
      deleteTodo();

      return;
    }

    if (newTitle.trim() === todo.title) {
      setIsLocalEditing(false);
      setNewTitle(todo.title);

      return;
    }

    updateTodo(event);
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
          onChange={updateTodo}
        />
      </label>

      {!isLocalEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            ref={editingTodo}
            onBlur={handleUpdateSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
