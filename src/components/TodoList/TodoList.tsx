import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  isAdding: boolean;
  toggleLoader: boolean;
  selectedId: number;
  title: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  handleUpdateTodo,
  isAdding,
  toggleLoader,
  selectedId,
  title,
}) => {
  const temp = {
    id: 0,
    title,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          handleUpdateTodo={handleUpdateTodo}
          isAdding={isAdding}
          toggleLoader={toggleLoader}
          selectedId={selectedId}
        />
      ))}
      {isAdding && (
        <div data-cy="Todo" className="todo" key={temp.id}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {temp.title}
          </span>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
