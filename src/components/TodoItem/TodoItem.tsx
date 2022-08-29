import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo | null) => void,
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  handleRenameTodo: (todoId: number, title: string) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  setSelectedTodo,
  handleDeleteTodo,
  handleUpdateTodoStatus,
  handleRenameTodo,
  isLoading,
}) => {
  const [title, setTitle] = useState(todo.title);

  const isChanging = selectedTodo?.id === todo.id;

  const handleSubmitForm = () => {
    setSelectedTodo(null);
    handleRenameTodo(todo.id, title);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => handleUpdateTodoStatus(todo)}
        />
      </label>

      {!isChanging ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleSubmitForm}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // defaultValue={todo.title}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleSubmitForm}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
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
