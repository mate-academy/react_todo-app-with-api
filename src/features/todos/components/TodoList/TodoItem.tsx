import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { TodoEditForm } from './TodoEditForm';

type Props = {
  todo: Todo;
  toggleTodoStatus: (todoId: number, todoCompleted: boolean) => void;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  updatingTodoTitle: string;
  setUpdatingTodoTitle: (value: string) => void;
  deleteTodo: (todoId: number) => void;
  handleSubmitEditTodos: (todo: Todo) => void;
  updatingTodos: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoStatus,
  selectedTodo,
  setSelectedTodo,
  updatingTodoTitle,
  setUpdatingTodoTitle,
  deleteTodo,
  handleSubmitEditTodos,
  updatingTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodo) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [selectedTodo]);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id, todo.completed)}
        />
      </label>

      {selectedTodo?.id !== todo.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodo(todo);
              setUpdatingTodoTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <TodoEditForm
          todo={todo}
          inputRef={inputRef}
          updatingTodoTitle={updatingTodoTitle}
          setUpdatingTodoTitle={setUpdatingTodoTitle}
          handleSubmitEditTodos={handleSubmitEditTodos}
        />
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={
          updatingTodos.includes(todo.id)
            ? 'modal overlay is-active'
            : 'modal overlay'
        }
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
