/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Todo as TodoType } from '../../types/Todo';
import { handleDeletePost } from '../../utils/deleteUtils';
import {
  handlePostTitleUpdate,
  handleTodoStatusUpdate,
} from '../../utils/updUtils';
import { useTodoActions } from '../../hooks/useTodosActions';

type TodoProps = {
  todo: TodoType;
  isTemporary?: boolean;
};

export const Todo: React.FC<TodoProps> = ({ todo, isTemporary = false }) => {
  const { state } = useContext(AppContext);
  const actions = useTodoActions();

  const { targetTodo, todoDeleteDisabled } = state;
  const isLoaderActive =
    todoDeleteDisabled.value && todoDeleteDisabled.targetId === todo.id;

  const [title, setTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus();
    }
  }, [targetTodo, state.errors]);

  // #region handlers
  const handleDelete = async (todoId: number) => {
    await handleDeletePost(todoId, actions);
  };

  const handleStatusUpdate = async (todoId: number) => {
    await handleTodoStatusUpdate(todoId, state, actions);
  };

  const handleDoubleClick = (todoId: number) => {
    actions.setTargetTodo(todoId);
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEditSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      await handleDelete(todo.id);

      return;
    }

    if (title !== todo.title) {
      const updatedTodo: TodoType = {
        ...todo,
        title: title.trim(),
      };

      const result = await handlePostTitleUpdate(updatedTodo, actions);

      if (!result.success) {
        if (editRef.current) {
          editRef.current.focus();
        }

        return;
      }
    }

    actions.setTargetTodo(0);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await handleEditSubmit(event);
    }

    if (event.key === 'Escape') {
      actions.setTargetTodo(0);
    }
  };
  // #endregion

  if (isTemporary) {
    return (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          x
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => handleDoubleClick(todo.id)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleStatusUpdate(todo.id)}
        />
      </label>

      {targetTodo === todo.id ? (
        <form onSubmit={() => handleEditSubmit}>
          <input
            ref={editRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleTodoChange}
            onKeyDown={handleKeyDown}
            onBlur={handleEditSubmit}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

Todo.displayName = 'Todo';
