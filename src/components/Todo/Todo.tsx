/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';

export const Todo = ({
  todo,
  isLoading,
  onChangeTodo: handleChangeTodo,
  removeTodo,
}: {
  todo: TodoType;
  isLoading: boolean;
  onChangeTodo: (todo: TodoType) => Promise<boolean>;
  removeTodo: (todoId: number) => Promise<boolean>;
}) => {
  const [editing, setEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const todoTitleInput = useRef<HTMLInputElement>(null);
  const isSaving = useRef(false);
  const skipBlurSave = useRef(false);

  async function saveChangedTodo() {
    if (isSaving.current) {
      return;
    }

    isSaving.current = true;
    const newTitle = todoTitle.trim();

    try {
      if (newTitle === todo.title) {
        setEditing(false);
      } else if (newTitle === '') {
        if (await removeTodo(todo.id)) {
          setEditing(false);
        }
      } else if (await handleChangeTodo({ ...todo, title: newTitle })) {
        setEditing(false);
      }
    } finally {
      isSaving.current = false;
    }
  }

  useEffect(() => {
    if (editing) {
      todoTitleInput.current?.focus();
    }
  }, [editing]);

  const cancelEditing = () => {
    skipBlurSave.current = true;
    setTodoTitle(todo.title);
    setEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() =>
            handleChangeTodo({ ...todo, completed: !todo.completed })
          }
          readOnly
        />
      </label>

      {editing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void saveChangedTodo();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={todoTitleInput}
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.preventDefault();

                cancelEditing();
              }
            }}
            onBlur={() => {
              if (skipBlurSave.current) {
                skipBlurSave.current = false;

                return;
              }

              void saveChangedTodo();
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setTodoTitle(todo.title);
            setEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading}
          onClick={() => void removeTodo(todo.id)}
        >
          ×
        </button>
      )}

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
  );
};
