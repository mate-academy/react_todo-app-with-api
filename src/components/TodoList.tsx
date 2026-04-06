/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  processingIds,
  setTodos,
  setProcessingIds,
  setError,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            setProcessingIds={setProcessingIds}
            setTodos={setTodos}
            inputRef={inputRef}
            setError={setError}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            setEditingTodoId={setEditingTodoId}
            editingTodoId={editingTodoId}
            processingIds={processingIds}
          />
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              className="todo__status"
              type="checkbox"
              checked={false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
