import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../../variables/UserID';

interface Props {
  todos: Todo[];
  activeTodo: Todo[];
  activeUpdate: Todo | null;
  tempUpdated: Todo | null;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  completeTodo: (todo: Todo) => void;
  setActiveTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  setActiveUpdate: React.Dispatch<React.SetStateAction<Todo | null>>;
  updateTodo: (updatedTodo: Todo) => void;
}

export const TodosList: React.FC<Props> = ({
  todos,
  activeTodo,
  activeUpdate,
  tempUpdated,
  tempTodo,
  deleteTodo,
  completeTodo,
  setActiveTodo,
  updateTodo,
  setActiveUpdate,
}) => {
  const [todosTitle, setTodosTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTodosTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodosTitle(event.target.value);
  };

  const onUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeUpdate) {
      return;
    }

    const normalizedTitle = todosTitle.trim();

    if (normalizedTitle === activeUpdate.title) {
      setActiveUpdate(null);

      return;
    }

    const diffTodo: Todo = {
      id: activeUpdate.id,
      userId: USER_ID,
      title: normalizedTitle,
      completed: activeUpdate.completed,
    };

    updateTodo(diffTodo);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeUpdate]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            onDoubleClick={() => {
              setActiveUpdate(todo);
              setTodosTitle(todo.title);
            }}
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => completeTodo(todo)}
              />
            </label>
            {/* eslint-enable jsx-a11y/label-has-associated-control */}

            {activeUpdate?.id === todo.id ? (
              <>
                <form
                  onBlur={onUpdate}
                  onSubmit={onUpdate}
                  onKeyUp={event => {
                    if (event.key === 'Escape') {
                      setActiveUpdate(null);
                    }
                  }}
                >
                  <input
                    ref={inputRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todosTitle}
                    onChange={handleTodosTitle}
                  />
                </form>
              </>
            ) : (
              <>
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    deleteTodo(todo.id);
                    setActiveTodo([todo]);
                  }}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  activeTodo.includes(todo) || tempUpdated?.id == todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div key={tempTodo.id} data-cy="Todo" className="todo">
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          {/* eslint-enable jsx-a11y/label-has-associated-control */}

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
