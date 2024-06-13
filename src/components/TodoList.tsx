import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds?: number[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
  onEditTodo?: (currentTodo: Todo) => void;
  serverError?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  handleToggleTodo = () => {},
  onDeleteTodo = () => {},
  onEditTodo = () => {},
  serverError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onloadingTodoIds={loadingTodoIds}
          handleToggleTodo={handleToggleTodo}
          handleTodoDelete={onDeleteTodo}
          onEdit={onEditTodo}
          errorMessageFromServer={serverError}
        />
      ))}
    </section>
  );
};
