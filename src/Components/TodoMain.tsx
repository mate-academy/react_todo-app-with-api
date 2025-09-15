import cn from 'classnames';
import { MessageError, Todo } from '../types/Todo';
import React, { useState } from 'react';
import '../styles/animation.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => Promise<void>;
  deletingIds: Set<number>;
  updateTodos: (todo: Todo) => Promise<void>;
  setErrorMessege: (message: string) => void;
};

export const TodoMain: React.FC<Props> = React.memo(
  ({
    visibleTodos,
    tempTodo,
    onDelete,
    deletingIds,
    updateTodos,
    setErrorMessege,
  }) => {
    const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [oldTodo, setOldTodo] = useState<Todo | undefined>(undefined);
    const [title, setTitle] = useState('');

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };

    const handleChangeCompleted = (todo: Todo) => {
      updateTodos({
        ...todo,
        completed: !todo.completed,
      });
    };

    const handleSubmit = async (e?: React.FormEvent | null) => {
      e?.preventDefault();

      const value = title.trim();

      if (!oldTodo) {
        return;
      }

      if (value === '') {
        try {
          await onDelete(oldTodo.id);
        } catch (error) {
          setIsEditing(true);
          setErrorMessege(MessageError.delete);

          throw error;
        }

        return;
      }

      if (oldTodo.title === value) {
        setIsEditing(false);

        return;
      }

      if (oldTodo.title !== value) {
        try {
          await updateTodos({ ...oldTodo, title: value });
          setIsEditing(false);
          setErrorMessege('');
        } catch (error) {
          setIsEditing(true);
          setErrorMessege(MessageError.update);
        }
      }
    };

    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {visibleTodos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <div
                key={todo.id}
                data-cy="Todo"
                onDoubleClick={() => {
                  setIsEditing(prev => !prev);
                  setActiveTodoId(todo.id);
                  setTitle(todo.title);
                  setOldTodo(todo);
                }}
                className={cn('todo', {
                  completed: todo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    onClick={() => handleChangeCompleted(todo)}
                    checked={todo.completed}
                  />
                  {}
                </label>

                {activeTodoId === todo.id && isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      onChange={handleTitleChange}
                      autoFocus
                      value={title}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setIsEditing(false);
                        }
                      }}
                      onBlur={() => {
                        if (isEditing) {
                          handleSubmit();
                        }
                      }}
                    />

                    {deletingIds.has(todo.id) && (
                      <div
                        data-cy="TodoLoader"
                        className="modal overlay is-active"
                      >
                        <div
                          className="modal-background
                        has-background-white-ter"
                        />
                        <div className="loader" />
                      </div>
                    )}
                  </form>
                ) : (
                  <>
                    <span data-cy="TodoTitle" className="todo__title">
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      onClick={() => onDelete(todo.id)}
                      data-cy="TodoDelete"
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active': deletingIds.has(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>

        {tempTodo && (
          <div
            key={tempTodo.id}
            data-cy="Todo"
            className={cn('todo', {
              completed: tempTodo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                disabled
              />
              {}
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
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
  },
);

TodoMain.displayName = 'TodoMain';
