import cn from 'classnames';

interface Props {
  title: string;
  id: number;
  completed: boolean;
  onDelete: (id: number) => void;
  onIsComplitedUpdate: (
    id: number,
    complitedCurrVal: boolean,
  ) => void;
  loading: boolean;
  loadingID: number;
}

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  onDelete,
  onIsComplitedUpdate,
  loading,
  loadingID,
}) => {
  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onIsComplitedUpdate(
              id,
              completed,
            );
          }}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': loading && loadingID === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
