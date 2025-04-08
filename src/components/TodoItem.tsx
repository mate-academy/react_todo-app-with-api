/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  todoOnLoading: number[] | null;
  handleToggle: (id: number) => void;
  handleEditTodo: (id: number, title: string) => Promise<boolean>;
};

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo,
  todoOnLoading,
  handleToggle,
  handleEditTodo,
}) => {
  const [isOnEdit, setIsOnEdit] = useState(false);
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);
  const isLoading = todoOnLoading && todoOnLoading.includes(todo.id);

  const save = async () => {
    try {
      const isSuccess = await handleEditTodo(todo.id, todoTitle);

      if (isSuccess) {
        setIsOnEdit(false);
      }
    } catch {
      setIsOnEdit(true);
    }
  };

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (todoTitle !== todo.title) {
        save();
      } else {
        setIsOnEdit(false);
      }
    }
  };

  const handleOnEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();

      setTodoTitle(todo.title);
      setIsOnEdit(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo.id)}
        />
      </label>

      {isOnEdit ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            onKeyDown={handleOnEnter}
            onKeyUp={handleOnEsc}
            onBlur={save}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsOnEdit(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
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
