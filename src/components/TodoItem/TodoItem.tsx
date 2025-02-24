import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
type Props = {
  todo: Todo;
  activeTodo: Todo | null;
  isProcessed: boolean;
  onDeleteTodo?: (id: number) => Promise<void>;
  onChangeTodo?: (t: Todo) => Promise<void>;
  onChangeActiveTodo?: (t: Todo | null) => void;
};

const EMPTY_TODO: Todo = {
  id: -1,
  userId: -1,
  title: '',
  completed: false,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  activeTodo,
  onDeleteTodo = () => null,
  onChangeTodo = () => null,
  onChangeActiveTodo = () => null,
}) => {
  const [inputValue, setInputValue] = useState('');
  const activeInput = useRef<HTMLInputElement | null>(null);
  const { title, id, completed } = todo;
  const { title: activeTitle, id: activeId } = activeTodo
    ? activeTodo
    : EMPTY_TODO;

  useEffect(() => {
    setInputValue(activeTodo ? activeTodo.title : '');
    activeInput.current?.focus();
  }, [activeTodo]);

  function changeTitle() {
    const normalizeInputValue = inputValue.trim();

    if (normalizeInputValue.length === 0) {
      onDeleteTodo(todo.id)
        ?.then(() => onChangeActiveTodo(null))
        .catch(() =>
          setTimeout(() => {
            activeInput.current?.focus();
          }, 0),
        );

      return;
    }

    if (normalizeInputValue === activeTitle) {
      onChangeActiveTodo(null);

      return;
    }

    onChangeTodo({ ...todo, title: normalizeInputValue })
      ?.then(() => {
        onChangeActiveTodo(null);
      })
      .catch(() =>
        setTimeout(() => {
          activeInput.current?.focus();
        }, 0),
      );
  }

  function onPressKeyInForm(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      changeTitle();
    } else if (e.key === 'Escape') {
      onChangeActiveTodo(null);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChangeTodo({ ...todo, completed: !completed })}
        />
      </label>

      {activeId === id ? (
        <form onKeyDown={onPressKeyInForm} onBlur={changeTitle}>
          <input
            ref={activeInput}
            placeholder="Empty todo will be deleted"
            data-cy="TodoTitleField"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.currentTarget.value)}
            className="todo__title-field"
            disabled={isProcessed}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onChangeActiveTodo(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
