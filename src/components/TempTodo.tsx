import { Todo } from '../types';

type Props = {
  tempTodo: Todo,
  handleDeleteTodo: (value: number) => void,
};

export const TempTodo: React.FC<Props> = ({ tempTodo, handleDeleteTodo }) => (
  <li
    className="todo"
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked={tempTodo.completed}
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
