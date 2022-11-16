import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void,
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => void,
  currTodo: number,
  setCurrTodo: (value: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isEditing,
  setIsEditing,
  updateTodoOnServer,
  currTodo,
  setCurrTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deletindId, setDeletingId] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [currTodo]);

  const handleRemoveTodo = () => {
    setDeletingId(todo.id);
    handleDeleteTodo(todo.id);
  };

  const handleChangeTodoStatus = (
    todoId: number, todoStatus: boolean,
  ) => {
    updateTodoOnServer(todoId, { completed: todoStatus });
  };

  const handleEditing = (todoId: number) => {
    setIsEditing(true);
    setCurrTodo(todoId);
    setNewTodoTitle(todo.title);
  };

  const handleBlur = () => {
    if (todo.title === newTodoTitle) {
      setIsEditing(false);
    } else if (!newTodoTitle) {
      handleDeleteTodo(todo.id);
    } else {
      updateTodoOnServer(todo.id, { title: newTodoTitle });
      setIsEditing(false);
    }
  };

  const handleKeyEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlur();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleEdit = (event: React.KeyboardEvent) => {
    handleKeyEditing(event);
  };

  const handleNewTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleChangeTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isEditing && (currTodo === todo.id)
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoField}
              value={newTodoTitle}
              onKeyDown={handleEdit}
              onChange={handleNewTodo}
              onBlur={handleBlur}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleEditing(todo.id)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === deletindId,
        })}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
