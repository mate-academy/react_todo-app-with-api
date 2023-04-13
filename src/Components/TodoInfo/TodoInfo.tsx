import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  isIncludes: boolean;
  onChangeStatusTodo?: (todoID: number) => void;
  onChangeNewTitle?: (todoID: number, todoNewTitle: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isIncludes,
  onChangeStatusTodo,
  onChangeNewTitle,
}) => {
  const { title, id } = todo;

  const [isClicked, setIsClicked] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setTodoTitle(value);
  };

  const handleUpdateTittleTodo = (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsClicked(false);

    if (todoTitle !== todo.title) {
      return onChangeNewTitle?.(id, todoTitle);
    }

    return '';
  };

  return (
    <>
      {isClicked ? (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
          onDoubleClick={() => setIsClicked((prev) => !prev)}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => onChangeStatusTodo?.(id)}
            />
          </label>

          <form onSubmit={handleUpdateTittleTodo}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleChangeTitleTodo}
            />
          </form>

          {isIncludes && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
          onDoubleClick={() => setIsClicked((prev) => !prev)}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => onChangeStatusTodo?.(id)}
            />
          </label>

          <span className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          {isIncludes && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
