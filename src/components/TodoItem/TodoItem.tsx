import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../context/TodosProvider';
interface Props {
  todo: Todo;
}

const TodoItem: FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const { todosInProcess, handleDeleteTodo, handleUpdateTodo } =
    useTodosContext();

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => setIsEditing(true);

  const updateState = (updatedTitle?: string) => {
    setIsEditing(false);

    if (updatedTitle) {
      setNewTitle(updatedTitle);
    }
  };

  const handleChangeTitle = () => {
    const trimmedNewTitle = newTitle.trim();

    if (title === trimmedNewTitle) {
      setIsEditing(false);

      return;
    }

    if (trimmedNewTitle) {
      handleUpdateTodo({ ...todo, title: trimmedNewTitle }, updateState)();
    } else {
      handleDeleteTodo(id, updateState)();
    }
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const onBlur = () => {
    handleChangeTitle();
  };

  const onSubmit = (event: FormEvent) => event.preventDefault();

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleChangeTitle();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={onChangeTitle}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosInProcess.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
