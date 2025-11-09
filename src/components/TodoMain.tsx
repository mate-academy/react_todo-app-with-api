import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { TodoUpdate } from '../types/TodoUpdate';
import { UpdateTodoTitleForm } from './UpdateTodoTitleForm';

type Props = {
  visibleTodos: Todo[];
  deleteLoading: boolean;
  loadTodoIds: number[];
  isLoading: boolean;
  tempTodo: Todo | null;
  onDelete: (todoId: Todo['id']) => void;
  onUpdate: (
    todoId: Todo['id'],
    body: TodoUpdate,
    onSuccess?: () => void,
  ) => void;
};

export const TodoMain: React.FC<Props> = ({
  visibleTodos,
  loadTodoIds,
  isLoading,
  // deleteLoading,
  tempTodo,
  onDelete,
  onUpdate,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedTodoId, setEditedTodoId] = useState<Todo['id'] | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!isLoading &&
        visibleTodos.map(todo => {
          return (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label
                className="todo__status-label"
                aria-label="toggle completed"
              >
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={event =>
                    onUpdate(todo.id, {
                      ...todo,
                      completed: event.target.checked,
                    })
                  }
                />
              </label>

              {editing && todo.id === editedTodoId ? (
                <UpdateTodoTitleForm
                  defaultValue={todo.title}
                  onSubmit={(newTitle: Todo['title']) => {
                    if (newTitle === todo.title) {
                      setEditing(false);

                      return;
                    }

                    if (!newTitle) {
                      onDelete(todo.id);

                      return;
                    }

                    onUpdate(todo.id, { ...todo, title: newTitle }, () =>
                      setEditing(false),
                    );
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEditing(true);
                      setEditedTodoId(todo.id);
                    }}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      onDelete(todo.id);
                    }}
                  >
                    ×
                  </button>
                </>
              )}

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': loadTodoIds.includes(todo.id),
                })}
              >
                {/* eslint-disable-next-line max-len */}
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="tempTodo" className="todo__status-label">
            <input
              id="tempTodo"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
