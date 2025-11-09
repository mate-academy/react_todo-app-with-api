import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect } from 'react';

interface Props {
  todo: Todo;
  selected: number | null;
  handleDoubleClick: (todo: Todo) => void;
  selectedTitle: string;
  setSelectedTitle: (str: string) => void;
  isSubmitting: boolean;
  deleteTodoHandler: (id: number) => void;
  loadingTodosId: number[];
  handleToggle: (todo: Todo) => void;
  setSelected: (item: number | null) => void;
  selectedRef: React.RefObject<HTMLInputElement>;
  handleTodoChange: (
    todo: Todo,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void;
}

export const TodoItem = ({
  todo,
  selected,
  handleDoubleClick,
  selectedTitle,
  setSelectedTitle,
  isSubmitting,
  deleteTodoHandler,
  loadingTodosId,
  handleToggle,
  setSelected,
  selectedRef,
  handleTodoChange,
}: Props) => {
  const statusInputId = `todo-${todo.id}-status`;
  const shouldLoad =
    loadingTodosId?.includes(todo.id) || (todo.id === 0 && isSubmitting);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSelected(null);
      setSelectedTitle('');
    }
  };

  useEffect(() => {
    if (todo.id === selected) {
      selectedRef.current?.focus();
    }
  }, [selected, todo.id, selectedRef]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
  }, [setSelected]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo ', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => handleDoubleClick(todo)}
    >
      <label
        htmlFor={statusInputId}
        className="todo__status-label"
        aria-label="Toggle todo completion"
        onClick={() => handleToggle(todo)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={statusInputId}
          checked={todo.completed}
        />
      </label>
      {todo.id === selected ? (
        <form onSubmit={event => handleTodoChange(todo, event)}>
          <input
            ref={selectedRef}
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectedTitle}
            onChange={event => setSelectedTitle(event.target.value)}
            onBlur={() => handleTodoChange(todo)}
            onKeyDown={e => onKeyDown(e)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isSubmitting}
            onClick={() => deleteTodoHandler(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': shouldLoad,
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
