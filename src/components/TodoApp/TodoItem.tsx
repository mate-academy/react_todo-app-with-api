import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../Context/StateContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Notification } from '../../types/Notification';
import { getUpdatedTodos } from '../../utils/getUpdatedTodos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, notification, coveredTodoIds } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const { id, title, completed } = todo;

  const [editedTitle, setEditedTitle] = useState(title);
  const [isEdited, setIsEdited] = useState(false);

  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdited && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEdited, notification]);

  const handleEditedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const correctEditedTitle = editedTitle.trim();

  const handleResponse = (response: Promise<Todo>) => {
    const updatedTodos = [...todos];

    dispatch({
      type: 'showLoader',
      todosIds: [...coveredTodoIds, id],
    });

    response
      .then((newTodo) => {
        dispatch({
          type: 'updateTodo',
          todos: getUpdatedTodos(updatedTodos, id, newTodo),
        });

        setIsEdited(false);
      })
      .catch(() => dispatch({
        type: 'showNotification',
        notification: Notification.UPDATE_TODO,
      }))
      .finally(() => dispatch({
        type: 'showLoader',
        todosIds: [0],
      }));
  };

  const handleChageTodoStatus = () => {
    handleResponse(updateTodo({
      ...todo,
      completed: !completed,
    }));
  };

  const removeTodo = () => {
    dispatch({
      type: 'showLoader',
      todosIds: [...coveredTodoIds, id],
    });

    deleteTodo(id)
      .then(() => dispatch({
        type: 'removeTodo',
        iD: id,
      }))
      .catch(() => dispatch({
        type: 'showNotification',
        notification: Notification.DELETE_TODO,
      }))
      .finally(() => dispatch({
        type: 'showLoader',
        todosIds: [0],
      }));
  };

  const handleDoubleClick = () => {
    setIsEdited(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (correctEditedTitle) {
      if (title === correctEditedTitle) {
        setIsEdited(false);
      } else {
        handleResponse(updateTodo({
          ...todo,
          title: correctEditedTitle,
        }));
      }
    } else {
      removeTodo();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChageTodoStatus}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleEditedTitle}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': coveredTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
