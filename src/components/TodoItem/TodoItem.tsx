import React, { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isLoadingTodo: boolean;
  changeTodoOnServer: (id: number, todo: Partial<Todo>) => Promise<void>;
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  isLoadingTodo,
  changeTodoOnServer,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState(0);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.length) {
      await changeTodoOnServer(id, { title: newTitle });
    } else {
      await deleteTodo(id);
    }

    setSelectedId(0);
  };

  const handleBlurAction = async () => {
    if (newTitle.length) {
      await changeTodoOnServer(id, { title: newTitle });
    } else {
      await deleteTodo(id);
    }

    setSelectedId(0);
  };

  const switchTodoCompletedOnServer = async () => {
    await changeTodoOnServer(id, { completed: !completed });
  };

  const inputFormOn = () => {
    setSelectedId(id);
    setNewTitle(title);
  };

  const setElementFocus = (element: HTMLInputElement | null) => {
    if (element) {
      element.focus();
    }
  };

  const escKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectedId(0);
    }
  };

  return (
    <div
      data-cy="TodoItem"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={switchTodoCompletedOnServer}
        />
      </label>

      {!selectedId
        ? (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={inputFormOn}
          >
            {title}
          </span>
        )
        : (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__change-todo"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleChangeTitle}
              ref={setElementFocus}
              onKeyDown={escKeyDown}
              onBlur={handleBlurAction}
            />
          </form>
        )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {isLoadingTodo && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
