/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';
import { useState } from 'react';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (a: number) => Promise<void>;
  handleUpdateTodo: (a: number, b: string, c: boolean) => Promise<void>;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  handleDeleteTodo,
  loadingIds,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');


  const handleRenaimTodo = (id: number, title: string) => {
    setIsEditing(id);
    setNewTitle(title);
  };

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
  ) => {
    if (event.key === 'Enter') {
      setIsEditing(null);
      if (newTitle.length === 0) {
        handleDeleteTodo(id).catch(() => setIsEditing(id));
      } else {
        handleUpdateTodo(id, newTitle, completed).catch(() => setIsEditing(id));
      }
    }

    if (event.key === 'Escape') {
      setIsEditing(null);
    }
  };

  const handleBlur = (id: number, completed: boolean) => {
    setIsEditing(null);
    if (newTitle.length === 0) {
      handleDeleteTodo(id).catch(() => setIsEditing(id));
    } else {
      handleUpdateTodo(id, newTitle, completed).catch(() => setIsEditing(id));
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(({ title, id, completed }) => (
        <>
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            <label
              htmlFor={`${id}`}
              className="todo__status-label"
              onClick={() =>
                handleUpdateTodo(id, title, completed ? false : true)
              }
            >
              <input
                id={`${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                value={title}
              />
            </label>

            {isEditing === id ? (
              <input
                id={`${id}`}
                data-cy="TodoTitleField"
                type="text"
                placeholder="Empty todo will be deleted"
                className="todo__title-field"
                value={newTitle}
                onKeyDown={event => handleKeyDown(event, id, completed)}
                onChange={handleNewTitle}
                onBlur={() => handleBlur(id, completed)}
                autoFocus
              />
            ) : (
              <>
                <span
                  id={`${id}`}
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleRenaimTodo(id, title)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loadingIds.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      ))}
      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </section>
  );
};
