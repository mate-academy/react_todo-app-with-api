import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { useInput } from '../../hooks/useInput';
import { Todo } from '../../types/Todo';

type Props = {
  onDelete: (id: number) => void,
  onHandleChangeTodo(data: object, id: number): void,
  isProcessed: boolean,
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  onHandleChangeTodo,
  onDelete,
  isProcessed,
  todo,
}) => {
  const editTodoField = useRef<HTMLInputElement>(null);
  const todoInput = useInput(todo.title);
  const [isEdit, setIsEdit] = useState(false);
  const toggleData = {
    completed: !todo.completed,
  };
  const editData = {
    title: todoInput.value,
  };

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [isEdit]);

  const handleInput = () => {
    if (todo.title === todoInput.value) {
      setIsEdit(false);

      return;
    }

    onHandleChangeTodo(editData, todo.id);
    setIsEdit(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleInput();
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          aria-label="input_field"
          data-cy="TodoStatus"
          type="checkbox"
          readOnly
          className="todo__status"
          checked={todo.completed}
          onClick={() => onHandleChangeTodo(toggleData, todo.id)}
        />
      </label>

      {isEdit ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={editTodoField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              {...todoInput}
              onBlur={() => handleInput()}
              onKeyDown={handleEsc}
            />
          </form>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEdit(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            disabled={isProcessed}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isProcessed },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </li>
  );
};
