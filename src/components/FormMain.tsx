import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todoTobeEdited: Todo | null;
  todos: Todo[];
  onRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
  processedTodos: number[];
};

export const FormMain: React.FC<Props> = (
  {
    todoTobeEdited, todos, onRemove, onTodoUpdate, processedTodos,
  },
) => {
  const [editTitle, setEditTitle] = useState(false);
  const [todoEdit, setTodoEdit] = useState(0);
  const [title, setTitle] = useState(todoTobeEdited?.title || '');

  const onSubmit = (td: Todo) => {
    if (td.title === '') {
      onRemove(td.id);
    }

    onTodoUpdate({
      ...td,
      title,
    });

    setEditTitle(false);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                onTodoUpdate({
                  ...todo,
                  completed: !todo.completed,
                });
              }}
            />
          </label>

          {editTitle && todoEdit === todo.id
            ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit(todo);
              }}
              >
                <input
                  type="text"
                  placeholder="Empty title will be deleted"
                  className="todo__title-field"
                  value={title}
                  onBlur={() => onSubmit(todo)}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                />
              </form>
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setTitle(todo.title);
                    setEditTitle(true);
                    setTodoEdit(todo.id);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onRemove(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames(
            'modal overlay',
            { 'is-active': processedTodos.includes(todo.id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
