import { useTodoContext } from '../../context/TodoProvider';

export const TempTodo = () => {
  const { tempTodo } = useTodoContext();
  const todoId = tempTodo ? tempTodo.id.toString() : undefined;

  return (
    <div data-cy="Todo" className="todo">
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={todoId} className="todo__status-label">
        <input
          id={todoId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
