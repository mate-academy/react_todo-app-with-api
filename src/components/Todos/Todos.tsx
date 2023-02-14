import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  updatingTodos: number[],
  updateTodo: (todoId: number, todoData: Partial<Todo>) => void,
};

export const Todos: React.FC<Props> = ({
  todos,
  deleteTodo,
  updatingTodos,
  updateTodo,
}) => {
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [titleValue, setTitleValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTodoId]);

  const handleTitleUpdate = (
    id: number,
    todoTitle: string,
  ) => {
    if (!titleValue) {
      deleteTodo(id);
      setEditTodoId(null);

      return;
    }

    if (todoTitle !== titleValue) {
      updateTodo(id, { title: titleValue });
    }

    setEditTodoId(null);
  };

  return (
    <section className="todoapp__main">
      {todos.map(({
        id,
        title,
        completed,
      }) => {
        return (
          <div
            className={cn('todo', { completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={completed}
                onChange={() => updateTodo(
                  id,
                  { completed: !completed },
                )}
              />
            </label>

            {id === editTodoId ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTitleUpdate(id, title);
                  }}
                >
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    ref={inputRef}
                    onBlur={() => handleTitleUpdate(id, title)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setTitleValue(title);
                        setEditTodoId(null);
                      }
                    }}
                  />
                </form>

                <div className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditTodoId(id);
                    setTitleValue(title);
                  }}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => deleteTodo(id)}
                >
                  ×
                </button>

                <div className={cn(
                  'modal overlay',
                  { 'is-active': updatingTodos.includes(id) },
                )}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            ) }
          </div>
        );
      })}
    </section>
  );
};
