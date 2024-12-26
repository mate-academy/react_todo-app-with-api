import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { SubmitFormEvent } from '../../types/htmlFormElements';

type Props = {
  isLoading?: boolean;
  todo: Todo;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isInEditMode?: boolean;
  setEditedTodoId: Dispatch<SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onRemoveTodo,
  onUpdateTodo,
  isInEditMode,
  setEditedTodoId,
}) => {
  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const onBlur = async (event: SubmitFormEvent) => {
    event.preventDefault();

    const normalizedTitle = todoTitleValue.trim();

    if (normalizedTitle === todo.title) {
      setEditedTodoId(null);

      return;
    }

    try {
      if (normalizedTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: todoTitleValue.trim() });
      }

      setEditedTodoId(null);
    } catch (err) {
      inputRef?.current?.focus();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTodoTitleValue(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onCheckTodo}
        />
      </label>
      {isInEditMode ? (
        <form onSubmit={onBlur} onBlur={onBlur}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleValue}
            onChange={event => setTodoTitleValue(event?.target.value)}
            onKeyUp={onKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
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
