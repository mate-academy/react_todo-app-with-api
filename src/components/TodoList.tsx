import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/types';
import { findTodoById } from '../utils/FilterTodoById';

type Props = {
  deleteTodo: (todoId: number) => void;
  todos: Todo[];
  isLoading: boolean;
  listOfTodosIds: number[];
  onDelete: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
  renameTodo: (todoId: number | null, query: string) => void;
  toggleTodo: (todoId: number | null) => void;
  listOfTodosIdsForChange: number[];
  onChanged: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  deleteTodo,
  todos,
  isLoading,
  listOfTodosIds,
  onDelete,
  tempTodo,
  renameTodo,
  toggleTodo,
  listOfTodosIdsForChange,
  onChanged,
}) => {
  const [todoId, setTodoId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const selectedTodo = findTodoById(todos, todoId);

  const handleUpdate = (event?: FormEvent) => {
    event?.preventDefault();

    if ((query !== null) && (!query.trim())) {
      if (todoId !== null) {
        deleteTodo(todoId);
      }

      return;
    }

    if (query === selectedTodo?.title) {
      setTodoId(null);

      return;
    }

    renameTodo(todoId, query);

    setTodoId(null);
    setQuery('');
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={(classNames('todo', {
            completed: todo.completed,
          }))}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => {
                toggleTodo(todo.id);
                onChanged([todo.id]);
              }}
            />
          </label>
          {todoId === todo.id ? (
            <form onSubmit={handleUpdate}>
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                type="text"
                value={query}
                className="todo__title-field"
                onChange={(event) => setQuery(event.target.value)}
                onBlur={handleUpdate}
                onKeyUp={(event) => {
                  if (event.key === 'Escape') {
                    setTodoId(null);
                  }
                }}
              />
            </form>
          ) : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => {
                  setTodoId(todo.id);
                  setQuery(todo.title);
                  onChanged([todo.id]);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  deleteTodo(todo.id);
                  onDelete([todo.id]);
                }}
              >
                ×
              </button>

              <div className={classNames('modal overlay', {
                'is-active': isLoading
                  && (listOfTodosIds.includes(todo.id)
                  || listOfTodosIdsForChange.includes(todo.id)
                  ),
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          )}
        </div>
      ))}

      {tempTodo
        && (
          <div className={classNames('todo', {
            'todo completed': tempTodo.completed,
          })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(tempTodo.id)}
            >
              ×
            </button>

            <div className={classNames('modal overley', {
              'modal overlay is-active': isLoading,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </section>
  );
};
