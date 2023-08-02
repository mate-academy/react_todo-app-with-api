import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isDeleted: number | null;
  isLoading: boolean,
  title: string,
  onChange: (todoId: number, todoTitle?: string) => Promise<void>,
  isUpdatingId: number | null,
  isChansingStatus: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isDeleted,
  isLoading,
  title,
  onChange,
  isUpdatingId,
  isChansingStatus,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [updatingTitle, setUpdatingTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editingTodoId !== null) {
        setUpdatingTitle('');
        setEditingTodoId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingTodoId]);

  const handleTitleDoubleClick = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setUpdatingTitle(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatingTitle(event.target.value);
  };

  const handleTitleSave = (todo: Todo) => {
    if (updatingTitle.length === 0) {
      onDelete(todo.id);
    } else if (updatingTitle !== todo.title) {
      onChange(todo.id, updatingTitle);
    }

    setUpdatingTitle('');
    setEditingTodoId(null);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div className={`todo ${todo.completed ? 'completed' : ''}`}>
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  onChange={() => onChange(todo.id)}
                />
              </label>

              {editingTodoId === todo.id ? (
                <form
                  onSubmit={() => handleTitleSave(todo)}
                  onBlur={() => handleTitleSave(todo)}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={updatingTitle}
                    onChange={handleTitleChange}
                  />
                </form>
              ) : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={() => handleTitleDoubleClick(todo)}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => onDelete(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div className={classNames('modal overlay', {
                'is-active': isChansingStatus
                  || (todo.id === isDeleted)
                  || (todo.id === isUpdatingId),
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {isLoading && (
          <CSSTransition
            key="loading"
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
