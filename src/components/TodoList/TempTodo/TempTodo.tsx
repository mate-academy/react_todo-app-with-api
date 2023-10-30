import { useTodosProvider } from '../../../providers/TodosContext';

export const TempTodo: React.FC = () => {
  const { tempTodo } = useTodosProvider();

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          title="checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
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
