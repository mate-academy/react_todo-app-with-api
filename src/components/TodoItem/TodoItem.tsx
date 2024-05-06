/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  ChangeEvent,
  FC,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../../providers';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const { todosInUpdate, isLoading } = useTodos();
  const { onDeleteTodo, onUpdateTodo } = useTodos();
  const [inEdit, setInEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    if (!isLoading && todo.title !== title.trim()) {
      setInEdit(true);
    }
  }, [isLoading, title, todo.title]);

  const handleDelete = () => onDeleteTodo(todo.id);
  const handleStartEdit = () => {
    setInEdit(true);
    setTitle(todo.title);
  };

  const handlTilteInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleUpdateTitle = (e?: FormEvent) => {
    e?.preventDefault();

    const newTitle = title.trim();

    if (!newTitle) {
      onDeleteTodo(todo.id);
    } else if (newTitle !== todo.title) {
      onUpdateTodo({ ...todo, title: newTitle });
    }

    setInEdit(false);
  };

  const handleCancel = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInEdit(false);
    }
  };

  const handleTogleTodo = () =>
    onUpdateTodo({ ...todo, completed: !todo.completed });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handleStartEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleTogleTodo}
        />
      </label>

      {inEdit ? (
        <form onSubmit={handleUpdateTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={handlTilteInputChange}
            autoFocus
            onBlur={handleUpdateTitle}
            onKeyUp={handleCancel}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todosInUpdate.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
