import { MouseEventHandler, useContext, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { GlobalContext } from '../context/GlobalContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    completed, title, id, userId,
  } = todo;

  const {
    deleteTodo,
    toggleTodo,
    isLoading,
    setQuery,
    selectedTodo,
    setSelectedTodo,
    query,
    changeTodoTitle,
  } = useContext(GlobalContext);

  const onRemoveHandler = (): MouseEventHandler<HTMLButtonElement> | void => {
    deleteTodo(id);
  };

  const onToggleTodo = () => toggleTodo({
    completed, title, id, userId,
  });

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    if (!selectedTodo) {
      return;
    }

    e.preventDefault();
    changeTodoTitle(selectedTodo);
  };

  const onDoubleClickHandler = () => {
    setSelectedTodo(todo);
    setQuery(todo.title);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    window.addEventListener('keydown', onEscape);

    return () => {
      window.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <>
      <div
        onDoubleClick={onDoubleClickHandler}
        className={cn('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={onToggleTodo}
          />
        </label>
        {selectedTodo?.id === id ? (
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={onChangeHandler}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveHandler()}
            >
              ×
            </button>
          </>
        )}

        <div
          className={cn('modal overlay', {
            'is-active': isLoading.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
