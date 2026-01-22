import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosList: Todo[];
  handleTodoDelete: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  processings: Set<number>;
  handleTodoUpdate: (todo: Todo) => Promise<void>;
  handleTodoToggle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todosList,
  handleTodoDelete,
  tempTodo,
  processings,
  handleTodoUpdate,
  handleTodoToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosList.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleTodoDelete={handleTodoDelete}
            processings={processings}
            handleTodoUpdate={handleTodoUpdate}
            handleTodoToggle={handleTodoToggle}
          />
        );
      })}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" aria-label="label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
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
