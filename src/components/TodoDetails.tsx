import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  isActive: boolean,
  deletedTodoIds: number[],
  activeTodoIds: number[],
  updateTodoData: (todoId: number, data: object) => void,
};

export const TodoDetails: React.FC<Props> = ({
  todo,
  deleteTodo,
  isActive,
  deletedTodoIds,
  activeTodoIds,
  updateTodoData,
}) => {
  const [isRenamingTodo, setIsRenamingTodo] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const isDeleted = (todoId: number) => {
    return deletedTodoIds?.includes(todoId);
  };

  const isLoadingTodo = (todoId: number) => {
    if (deletedTodoIds.length !== 0) {
      return isDeleted(todoId) && isActive;
    }

    if (activeTodoIds.length === 0) {
      return isActive;
    }

    return activeTodoIds.includes(todoId) && isActive;
  };

  const toggleTodoStatus = () => {
    return updateTodoData(todo.id, { completed: !todo.completed });
  };

  const renameTodo = () => {
    setIsRenamingTodo(false);

    if (newTitle.trim() === todo.title) {
      return;
    }

    if (!newTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    updateTodoData(todo.id, { title: newTitle });
  };

  const handleBlur = () => {
    renameTodo();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    renameTodo();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsRenamingTodo(false);
      setNewTitle(todo.title);
    }
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
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodoStatus}
        />
      </label>

      {isRenamingTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={newTodoField}
            value={newTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsRenamingTodo(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoadingTodo(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
