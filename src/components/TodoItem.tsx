import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void,
  selectedTodos: number[],
  isEditing: boolean,
  setisEditing: (value: boolean) => void,
  setSelectedTodos: (value: number[]) => void,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => void,
  currTodo: number,
  setCurrTodo: (value: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  selectedTodos,
  isEditing,
  setisEditing,
  setSelectedTodos,
  updateTodoOnServer,
  currTodo,
  setCurrTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [currTodo]);

  const handleChangeTodoStatus = (
    todoId: number, todoStatus: boolean,
  ) => {
    updateTodoOnServer(todoId, { completed: todoStatus });
    setSelectedTodos([todoId]);
  };

  const handleEditing = (todoId: number) => {
    setisEditing(true);
    setCurrTodo(todoId);
    setNewTodoTitle(todo.title);
  };

  const handleBlur = () => {
    if (todo.title === newTodoTitle) {
      setisEditing(false);
    } else if (!newTodoTitle) {
      handleDeleteTodo(todo.id);
    } else {
      setSelectedTodos([todo.id]);
      updateTodoOnServer(todo.id, { title: newTodoTitle });
      setisEditing(false);
    }
  };

  const handleKeyEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlur();
    }

    if (event.key === 'Escape') {
      setisEditing(false);
    }
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
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoField}
              value={newTodoTitle}
              onKeyDown={(event) => handleKeyEditing(event)}
              onChange={(event) => setNewTodoTitle(event.target.value)}
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
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': selectedTodos.includes(todo.id),
        })}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
