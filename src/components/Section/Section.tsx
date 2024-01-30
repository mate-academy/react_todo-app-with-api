import classNames from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../TodoContext';

type Props = {
  visibleTodos: Todo[];
  onDelete?: (id: number) => void;
  tempTodo: Todo | null;
  toggleStatus: (todo: Todo) => void;
  onSubmit: (todo: Todo) => void;
};

export const Section: React.FC<Props> = ({
  visibleTodos,
  onDelete = () => { },
  tempTodo,
  toggleStatus = () => { },
  onSubmit,
}) => {
  const {
    selectedId,
    setSelectedId,
    isEditing,
    setIsEditing,
    updatedTitle,
    setUpdatedTitle,
    isLoading,
  } = useTodos();

  const inputReference = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputReference.current && isEditing) {
      inputReference.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event: React.FormEvent, todo: Todo) => {
    event.preventDefault();

    if (todo.title === updatedTitle) {
      setIsEditing(false);

      return;
    }

    onSubmit(todo);
  };

  const handleBlur = (todo: Todo) => {
    if (todo.title === updatedTitle) {
      setIsEditing(false);

      return;
    }

    onSubmit(todo);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  let placeholder = '';

  if (!updatedTitle) {
    placeholder = 'Empty todo will be deleted';
  }

  const handleDoubleClick = (todo: Todo) => {
    setIsEditing(true);
    setSelectedId([todo.id]);
    setUpdatedTitle(todo.title);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
                active: !todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => toggleStatus(todo)}
                />
              </label>

              {isEditing && selectedId?.includes(todo.id)
                ? (
                  <form
                    onSubmit={(event) => handleSubmit(event, todo)}
                  >
                    <input
                      onBlur={() => handleBlur(todo)}
                      ref={inputReference}
                      onChange={handleTitleChange}
                      value={updatedTitle}
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder={placeholder}
                      onKeyUp={handleKeyUp}
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => handleDoubleClick(todo)}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => onDelete(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': (selectedId?.includes(todo.id) && isLoading),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: tempTodo.completed,
                active: !tempTodo.completed,
              })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  readOnly
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tempTodo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': isLoading,
                })}
              >
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
