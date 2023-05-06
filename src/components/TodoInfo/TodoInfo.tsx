import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todos: Todo[];
  isLoadingTodo: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdateTodo,
  setTodos,
  todos,
  isLoadingTodo,
}) => {
  const [hasUpdateError, setHasUpdateError] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleUpdateTodoTitle = (selectedTodoToChange: Todo) => {
    updateTodo(selectedTodoToChange.id, { title: newTitle })
      .then((updatedTodo: Todo) => {
        setTodos((currentTodos) => {
          const todoIndex = todos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          if (todoIndex > -1) {
            return [
              ...todos.slice(0, todoIndex),
              updatedTodo,
              ...todos.slice(todoIndex + 1),
            ];
          }

          return currentTodos;
        });
      })
      .catch(() => {
        setHasUpdateError(true);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleStartEditingTitle = () => {
    setEditingTitle(true);
  };

  const handleFinishEditingTitle = () => {
    if (newTitle !== todo.title) {
      handleUpdateTodoTitle(todo);
    }

    setEditingTitle(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFinishEditingTitle();
    }
  };

  const handleStatusTodo = () => {
    onUpdateTodo(todo);
  };

  return (
    <div
      className={classNames('todo',
        {
          completed: todo.completed,
        })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusTodo}
        />
        {hasUpdateError && <p>Failed to update todo</p>}
      </label>

      {!editingTitle && (
        <span
          className="todo__title"
          onDoubleClick={handleStartEditingTitle}
        >
          {todo.title}
        </span>
      )}

      {editingTitle && (
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={handleTitleChange}
          onBlur={handleFinishEditingTitle}
          onKeyDown={handleKeyDown}
        />
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoadingTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
