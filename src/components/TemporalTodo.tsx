import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TemporalTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo && tempTodo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
