/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTitleForm } from '../UpdateTitleForm';

type Props = {
  todo: Todo,
  onToggleTodo: (id: number) => void,
  isDeletedId: number,
  handleDelete: (id: number) => void,
  loadingIds: number[],
  handleSubmit: (title: string, id: number) => void,
  clickedId: number,
  isDoubleClicked: boolean,
  setClickedId: (id: number) => void,
  setIsDoubleClicked: (isDouble: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo, onToggleTodo, isDeletedId, handleDelete, loadingIds, handleSubmit,
  clickedId, isDoubleClicked, setClickedId, setIsDoubleClicked,
}) => {
  const handleDoubleClick = (id: number) => {
    setIsDoubleClicked(true);
    setClickedId(id);
  };

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

      {clickedId === todo.id && isDoubleClicked && (
        <UpdateTitleForm
          id={todo.id}
          title={todo.title}
          handleSubmit={handleSubmit}
          setClickedId={setClickedId}
          setIsDoubleClicked={setIsDoubleClicked}
        />
      )}

      {clickedId !== todo.id && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={(event) => {
              if (event.detail === 2) {
                handleDoubleClick(todo.id);
              }
            }}
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
};
