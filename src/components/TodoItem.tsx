import {
  FC, FormEvent, KeyboardEvent, useCallback, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (x: number) => void,
  toggleTodoStatus: (todoId: number) => void,
  updateTodoTitle: (x: number, y: string) => void,
  processing: boolean,
};
export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodoStatus,
  updateTodoTitle,
  processing,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');

  const handleEditModeOn = (todoTitle: string) => {
    setEditMode(true);
    setUpdatedTitle(todoTitle);
  };

  const handleEditSubmit = useCallback(
    (event :FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!updatedTitle.trim()) {
        deleteTodo(todo.id);
      }

      updateTodoTitle(todo.id, updatedTitle);
      setEditMode(false);
    }, [updatedTitle],
  );

  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditMode(false);
    }
  };

  return (
    <section className="todoapp__main">
      <div
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleTodoStatus(todo.id)}
            disabled={processing}
          />
        </label>
        {editMode ? (
          <form onSubmit={(event) => (
            handleEditSubmit(event)
          )}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              disabled={processing}
              onChange={(event) => setUpdatedTitle(event.target.value)}
              onKeyUp={(event) => handleOnKeyUp(event)}
              onBlur={() => updateTodoTitle(todo.id, updatedTitle)}
              // autoFocus
            />
          </form>
        )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => handleEditModeOn(todo.title)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

        <div className={classNames('modal overlay',
          { 'is-active': processing })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
