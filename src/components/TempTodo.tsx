import { Todo } from '../types';

type Props = {
  tempTodo: Todo,
  handleDeleteTodo: (value: number) => void,
};

export const TempTodo: React.FC<Props> = ({ tempTodo, handleDeleteTodo }) => {
  return (
    <li
      className="todo"
      key={tempTodo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={false}
        />
      </label>

      <span className="todo__title">
        {tempTodo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(tempTodo.id)}
      >
        ×
      </button>

      <div
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
