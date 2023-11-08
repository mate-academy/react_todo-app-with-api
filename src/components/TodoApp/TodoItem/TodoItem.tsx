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

import { DispatchContext, StateContext, actionCreator } from '../../TodoStore';
import { TodoError } from '../../../types/TodoError';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo,
};

type UpdatingTodoEvent =
| React.FocusEvent<HTMLInputElement>
| React.MouseEvent<HTMLInputElement, MouseEvent>
// | React.FormEvent<HTMLFormElement>
| React.KeyboardEvent<HTMLInputElement>;

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(DispatchContext);
  const {
    loadingItemsId,
    isSubmitting,
    isUpdating,
    isDeleting,
    selectedFilter,
  } = useContext(StateContext);

  const editingTodo = useRef<HTMLInputElement>(null);
  const isLoader = loadingItemsId.includes(todo.id)
    && (isSubmitting || isUpdating || isDeleting);

  useEffect(() => {
    if (editingTodo.current) {
      editingTodo.current.focus();
    }
  }, [isEditing]);

  const deleteTodo = useCallback(() => {
    dispatch(actionCreator.addLoadingItemId(todo.id));
    dispatch(actionCreator.toggleDeleting());
    dispatch(actionCreator.clearError());
    todoService.deleteTodo(todo.id)
      .then(() => {
        dispatch(actionCreator.updateTodos({
          delete: todo.id, filter: selectedFilter,
        }));
      })
      .catch(() => {
        dispatch(actionCreator.addError(TodoError.ErrorDelete));
      })
      .finally(() => {
        dispatch(actionCreator.toggleDeleting());
        dispatch(actionCreator.clearLoadingItemsId());
        setIsEditing(false);
      });
  }, [dispatch, selectedFilter, todo.id]);

  const updateTodo = useCallback(
    (event: UpdatingTodoEvent) => {
      const updatedTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: todo.completed,
      };

      switch ((event.target as HTMLInputElement).type) {
        case 'checkbox':
          updatedTodo.completed = !todo.completed;
          break;

        case 'text':
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
          dispatch(actionCreator.updateTodos({
            update: newTodo, filter: selectedFilter,
          }));
        })
        .catch((error) => {
          dispatch(actionCreator.addError(TodoError.ErrorUpdate));
          throw error;
        })
        .then(() => setIsEditing(false))
        .finally(() => {
          dispatch(actionCreator.toggleUpdating());
          dispatch(actionCreator.clearLoadingItemsId());
        });
    }, [
      dispatch,
      newTitle,
      selectedFilter,
      todo.completed,
      todo.id,
      todo.title,
      todo.userId,
    ],
  );

  const handleBlur = (
    event: UpdatingTodoEvent,
  ) => {
    if (!newTitle.trim()) {
      deleteTodo();

      return;
    }

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    updateTodo(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Escape': {
        setIsEditing(false);
        setNewTitle(todo.title);
        break;
      }

      case 'Enter':
        handleBlur(event);
        break;

      default:
        break;
    }
  };

  // const handleUpdateSubmit = (event: UpdatingTodoEvent) => {
  //   event.preventDefault();
  //   handleBlur(event);
  // };

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
          onClick={updateTodo}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
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
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            ref={editingTodo}
            onBlur={handleBlur}
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
