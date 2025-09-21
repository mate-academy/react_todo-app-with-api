import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  processingIds: number[];
  deleteTodo: (value: number) => Promise<void>;
  changeTodo: (id: number, newValue: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processingIds,
  deleteTodo,
  changeTodo,
}) => {
  const [todoValue, setTodoValue] = useState('');
  const [isFormShow, setIsFormShow] = useState<boolean>(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isFormShow]);

  function handleDoubleClick() {
    setTodoValue(todo.title);
    setIsFormShow(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setTodoValue(event.target.value);
  }

  function cancelEditing() {
    setTodoValue(todo.title);
    setIsFormShow(false);
  }

  function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const value = todoValue.trim();

    if (value === '') {
      deleteTodo(todo.id);

      return;
    }

    if (value === todo.title) {
      setIsFormShow(false);

      return;
    }

    changeTodo(todo.id, { title: todoValue.trim() })
      .then(() => {
        setIsFormShow(false);
      })
      .catch(() => {
        setIsFormShow(true);
      });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      cancelEditing();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'item-enter-done': isFormShow,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            changeTodo(todo.id, { completed: !todo.completed });
          }}
        />
      </label>
      {!isFormShow && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {isFormShow && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoValue}
            ref={titleField}
            onChange={handleInput}
            onBlur={() => setTimeout(() => handleSubmit(), 0)}
            onKeyDown={e => {
              handleKeyDown(e);
            }}
          />
        </form>
      )}

      {!isFormShow && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
