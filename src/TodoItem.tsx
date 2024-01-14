import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoLoader } from './TodoLoader';
import { deleteTodo, updateTitleTodo, updateTodo } from './api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  userId: number;
  clearCompleted: boolean;
  loadingAll: boolean;
  setErrorMessage: (error: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  userId,
  clearCompleted,
  setErrorMessage,
  loadingAll,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDelete = (todoId: number) => {
    setLoading(true);
    deleteTodo(userId, todoId)
      .then(() => {
        const updatedTodos = todos.filter((item) => item.id !== todoId);

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTitle(newTitle);
  };

  const handleFormSubmit = (todoId: number) => {
    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      handleDelete(todoId);

      return;
    }

    setLoading(true);
    updateTitleTodo(userId, todoId, newTitle)
      .then(() => {
        const updatedTodos = todos.map((todoItem) => (todoItem.id === todoId
          ? { ...todoItem, title: newTitle } : todoItem));

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
      });
  };

  const handleBlur = (todoId: number) => {
    handleFormSubmit(todoId);
  };

  const onKeyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (e.key === 'Enter') {
      handleFormSubmit(todoId);
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  const handleCheckboxChange = (todoId: number) => {
    setLoading(true);
    updateTodo(
      userId,
      todoId,
      !todos.find((todoItem) => todoItem.id === todoId)?.completed,
    )
      .then(() => {
        const updatedTodos = todos.map((todoItem) => (todoItem.id === todoId
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem));

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleCheckboxChange(todo.id)}
          />
        </label>
        {isEditing ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => handleBlur(todo.id)}
              ref={inputRef}
              onKeyDown={(e) => onKeyDownHandler(e, todo.id)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              onDoubleClick={handleDoubleClick}
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
              disabled={loading}
            >
              ×
            </button>
          </>
        )}
        {(loading || loadingAll || (clearCompleted && todo.completed)) && (
          <TodoLoader />
        )}
      </div>
    </>
  );
};
