import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  toggleTodo: (toggledTodo: Todo) => void,
  deleteTodo: (todoId: number) => void,
  processedTodos: number[],
};

export const Main: React.FC<Props> = ({
  todos,
  toggleTodo,
  deleteTodo,
  processedTodos,
}) => {
  const [changeTodoId, setChangeTodoId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  const submit = (todo: Todo) => {
    if (!title) {
      deleteTodo(todo.id);
    }

    toggleTodo({
      ...todo,
      title,
    });

    setIsEdited(false);
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
          </label>

          {isEdited && changeTodoId === todo.id
            ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                submit(todo);
              }}
              >
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={title}
                  onBlur={() => submit(todo)}
                  onChange={(event) => {
                    setTitle(event?.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setTitle(title);
                      setChangeTodoId(0);
                    }
                  }}
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setTitle(todo.title);
                    setIsEdited(true);
                    setChangeTodoId(todo.id);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames('modal overlay', {
            'is-active': processedTodos.includes(todo.id),
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
