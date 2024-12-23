import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type FormEventType =
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLFormElement, Element>;

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  isLoading?: boolean;
  handleUpdateTodo: (todoToUpdate: Todo) => Promise<void>;
  isInEditMode?: boolean;
  setEditedTodoId: Dispatch<SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    handleDeleteTodo,
    handleUpdateTodo,
    isInEditMode,
    setEditedTodoId,
  } = props;

  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheckTodo = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    handleUpdateTodo(updatedTodo);
  };

  const handleDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const handleSubmit = async (event: FormEventType) => {
    event.preventDefault();

    const normalizedTitle = todoTitleValue.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodoId(null);

      return;
    }

    if (normalizedTitle === '') {
      try {
        await handleDeleteTodo(todo.id);
        setEditedTodoId(null);
      } catch {
        inputRef?.current?.focus();
      }

      return;
    }

    try {
      await handleUpdateTodo({ ...todo, title: normalizedTitle });
      setEditedTodoId(null);
    } catch {
      inputRef?.current?.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTodoTitleValue(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckTodo}
        />
      </label>
      {isInEditMode ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleValue}
            onChange={event => setTodoTitleValue(event.target.value)}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
