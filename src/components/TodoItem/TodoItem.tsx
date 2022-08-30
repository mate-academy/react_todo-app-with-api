import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo | null) => void,
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  handleRenameTodo: (todo: Todo, title: string) => void,
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

  const editField = useRef<HTMLInputElement>(null);

  const isChanging = selectedTodo?.id === todo.id;

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isChanging]);

  const handleSubmitForm = () => {
    setSelectedTodo(null);
    handleRenameTodo(todo, title);
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
            defaultValue={todo.title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleSubmitForm}
            ref={editField}
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
