import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { findTodoById } from '../utils/findTodoById';

type Props = {
  deleteTodo: (todoId: number) => void;
  todos: Todo[];
  isLoading: boolean;
  listOfTodosIds: number[];
  setListOfTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
  updateTodo: (todoId: number | null, query?: string) => void
  listOfTodosIdsForChange: number[];
  setListOfTodosIdsForChange: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoMain: React.FC<Props> = ({
  deleteTodo,
  todos,
  isLoading,
  listOfTodosIds,
  setListOfTodosIds,
  tempTodo,
  updateTodo,
  listOfTodosIdsForChange,
  setListOfTodosIdsForChange,
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

    updateTodo(todoId, query);

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
                updateTodo(todo.id);
                setListOfTodosIdsForChange([todo.id]);
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
                  setListOfTodosIdsForChange([todo.id]);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  deleteTodo(todo.id);
                  setListOfTodosIds([todo.id]);
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
