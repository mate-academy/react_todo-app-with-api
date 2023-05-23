import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isTodoId?: number;
  onDeleteTodo: (value: number) => void;
  onChangeTodoTitle: (todoId: number, value: string) => void;
  onChangeTodoCompleted: (todoId: number, value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onChangeTodoTitle,
  onChangeTodoCompleted,
  isTodoId,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { completed, title, id } = todo;

  const handleDoubleClick = () => {
    setIsEdit(true);
    setQuery(title);
  };

  const hanldeResetInputChange = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEdit(false);
      setQuery(title);
    }
  };

  const handleNewTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChangeTodoTitle(id, query);

    if (query === title) {
      setIsEdit(false);
      setQuery(title);
    }

    if (query === '') {
      onDeleteTodo(id);
    }

    setQuery(query);
    setIsEdit(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEdit]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={() => onChangeTodoCompleted(id, !completed)}
        />
      </label>

      {isEdit ? (
        <form
          onSubmit={handleNewTitle}
          onBlur={handleNewTitle}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            onKeyDown={hanldeResetInputChange}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isTodoId === id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
