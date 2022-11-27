import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo, deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  handleLoadTodos: () => void;
  isEditing?: boolean;
};

export const InfoTodo: React.FC<Props> = ({
  todo,
  handleLoadTodos,
  isEditing,
}) => {
  const { title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(title);
  const [isDoubleClick, setIsDoubleClick] = useState(false);

  const handleTodoStatus = async () => {
    try {
      setIsLoading(true);
      await updateTodo(todo.id, { completed: !completed });
      setIsLoading(false);
      handleLoadTodos();
    } catch {
      throw new Error();
    }
  };

  const handleDeleteTodo = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(todo.id);
      handleLoadTodos();
    } catch {
      throw new Error();
    }
  };

  const handleEditTodo = (event: { preventDefault: () => void; }) => {
    try {
      event.preventDefault();
      updateTodo(todo.id, { title: value });
      setIsDoubleClick(false);
    } catch {
      throw new Error();
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoStatus}
        />
      </label>

      {!isDoubleClick ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClick(true)}
          >
            {value}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleEditTodo}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What needs to be done?"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isEditing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
