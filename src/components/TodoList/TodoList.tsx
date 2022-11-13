/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { useState } from 'react';
import { changeTodo } from '../../api/todos';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { UpdateTitleForm } from '../UpdateTitleForm';

type Props = {
  todos: Todo[],
  title: string,
  isAdding: boolean,
  isDeletedId: number;
  handleDelete: (id: number) => void;
  loadingIds: number[];
  onToggleTodo: (id: number) => void,
  getTodosFromsServer: () => void,
  setError: (err: Error) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, title, isAdding, isDeletedId, handleDelete, loadingIds, onToggleTodo,
  getTodosFromsServer, setError,
}) => {
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [clickedId, setClickedId] = useState(0);

  const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>, id: number) => {
    if (event.detail === 2) {
      setIsDoubleClicked(true);
      setClickedId(id);
    }
  };

  const handleSubmit = async (newTitle: string, id: number) => {
    try {
      const todoUpdated = todos.find(todo => todo.id === id);

      if (todoUpdated) {
        await changeTodo(id, { title: newTitle });
        setIsDoubleClicked(false);
      }

      await getTodosFromsServer();
    } catch {
      setError(Error.OnUpdating);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
                onClick={() => onToggleTodo(todo.id)}
              />
            </label>

            {isDoubleClicked && (
              <UpdateTitleForm
                id={todo.id}
                title={todo.title}
                handleSubmit={handleSubmit}
                setIsDoubleClicked={setIsDoubleClicked}
              />
            )}

            {!isDoubleClicked && (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onClick={() => {
                    handleDoubleClick(event, todo.id);
                  }
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isDeletedId === todo.id
                  || loadingIds.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
