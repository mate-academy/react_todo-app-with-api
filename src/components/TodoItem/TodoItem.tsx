import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteTodoHandler: (id: number) => void;
  loadingIds?: number[];
  toggleTodo: (todo: Todo) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};

const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoHandler,
  loadingIds,
  toggleTodo,
  updateTodoTitle,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  const deleteBtnHandler = (id: number) => {
    deleteTodoHandler(id);
  };

  const handleDoubleClick = () => {
    setIsEditingTitle(true);
    setTitle(todo.title);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      deleteTodoHandler(todo.id);

      return;
    }

    if (todo.title !== newTitle) {
      try {
        await updateTodoTitle(todo.id, newTitle);
        setIsEditingTitle(false);
      } catch {}
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {!isEditingTitle ? (
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
            onClick={() => deleteBtnHandler(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds && loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
