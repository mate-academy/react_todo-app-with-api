import React, { Dispatch, SetStateAction } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadingIds: number[];
  tempTodo: Todo | null;
  isBeingEdited: Todo | null;
  setIsBeingEdited: Dispatch<SetStateAction<null | Todo>>;
  onUpdateTodo: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleToggleTodo,
  onDeleteTodo,
  loadingIds,
  tempTodo,
  isBeingEdited,
  setIsBeingEdited,
  onUpdateTodo,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleToggleTodo={handleToggleTodo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          loadingIds={loadingIds}
          isBeingEdited={isBeingEdited}
          setIsBeingEdited={setIsBeingEdited}
          onUpdateTodo={onUpdateTodo}
          setLoadingIds={setLoadingIds}
        />
      ))}
      {tempTodo && (
        <div>
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: tempTodo.completed,
            })}
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                onChange={() => handleToggleTodo(tempTodo.id)}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title.trim()}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDeleteTodo(tempTodo.id);
              }}
            >
              ×
            </button>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
