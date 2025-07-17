/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loading: boolean;
  deletingTodos: number[];
  onToggleTodo: (todo: Todo) => void;
  updatingTodo: number[];
  setUpdatingTodo: React.Dispatch<React.SetStateAction<number[]>>;
  hiddenError: (message: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  onDelete,
  loading,
  deletingTodos,
  onToggleTodo,
  updatingTodo,
  setUpdatingTodo,
  hiddenError,
  setTodos,
}) => {
  const [editTodo, setEditTodo] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleUpdateTitle = async (todo: Todo) => {
    const titleTrim = editTitle.trim();

    if (titleTrim === '') {
      try {
        await onDelete(todo.id);
        setEditTodo(null);
      } catch {
        hiddenError('Unable to delete a todo');
      }

      return;
    }

    if (titleTrim == todo.title) {
      setEditTodo(null);

      return;
    }

    setUpdatingTodo(prev => [...prev, todo.id]);

    try {
      await updateTodo(todo.id, { title: titleTrim });
      setTodos(prev =>
        prev.map(tod =>
          tod.id === todo.id ? { ...tod, title: titleTrim } : tod,
        ),
      );
      setEditTodo(null);
    } catch {
      hiddenError('Unable to update a todo');
    } finally {
      setUpdatingTodo(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (e.key === 'Escape') {
      setEditTodo(null);
      setEditTitle('');
    }

    if (e.key === 'Enter') {
      handleUpdateTitle(todo);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
                loading: deletingTodos.includes(todo.id),
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  disabled={deletingTodos.includes(todo.id)}
                  onChange={() => onToggleTodo(todo)}
                />
              </label>

              {editTodo === todo.id ? (
                <input
                  data-cy="TodoTitleField"
                  className="todo__title-field"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={() => handleUpdateTitle(todo)}
                  onKeyDown={e => handleKeyDown(e, todo)}
                  autoFocus
                />
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditTodo(todo.id);
                    setEditTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )}

              {editTodo !== todo.id && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo.id)}
                  disabled={deletingTodos.includes(todo.id)}
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames('modal', 'overlay', {
                  'is-active':
                    deletingTodos.includes(todo.id) ||
                    updatingTodo.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>

              <span className="todo__title" data-cy="TodoTitle">
                {tempTodo.title}
              </span>
              <button type="button" className="todo__remove" disabled>
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal', 'overlay', {
                  'is-active': loading,
                })}
              />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
