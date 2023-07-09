import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useState,
} from 'react';

import { TodoType } from '../../types/Todo';
import { useTodos } from '../../contexts/todosContext';

type TodoProps = {
  todo: TodoType;
  isProcessed: boolean;
};

export const Todo = ({ todo, isProcessed }: TodoProps) => {
  const { completed, title } = todo;

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const {
    isLoading,
    handleDeleteTodo,
    handleToggleCompleted,
    handleTitleUpdate,
    addToProcessed,
  } = useTodos();

  const handleDeleteClick = useCallback(() => {
    addToProcessed([todo]);
    handleDeleteTodo(todo);
  }, [todo]);

  const onTodoTitleChange = useCallback(
    (value: string) => {
      if (!value) {
        handleDeleteClick();

        return;
      }

      if (title !== value) {
        handleTitleUpdate(todo, value);
      }

      setEditing(false);
    },
    [todo],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setInputValue(e.target.value);
    },
    [todo],
  );

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setEditing(false);
        setInputValue(title);
      }
    },
    [todo],
  );

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => {
            addToProcessed([todo]);
            handleToggleCompleted(todo);
          }}
        />
      </label>

      {editing ? (
        <form
          onSubmit={() => {
            onTodoTitleChange(inputValue);
          }}
        >
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => onTodoTitleChange(inputValue)}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{inputValue}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isLoading && isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
