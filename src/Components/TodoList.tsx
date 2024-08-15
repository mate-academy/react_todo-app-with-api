import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  mainTodoList: Todo[];
  updateToggle: (toggleTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number[];
  updateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  mainTodoList,
  updateToggle,
  deleteTodo,
  tempTodo,
  loadingTodoId,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {mainTodoList.length > 0 &&
        mainTodoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateToggle={updateToggle}
            deleteTodo={deleteTodo}
            loadingTodoId={loadingTodoId}
            updateTodo={updateTodo}
          />
        ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
