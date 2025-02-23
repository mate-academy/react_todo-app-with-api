import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  preparedTodos: Todo[];
  tempTodo: null | Todo;
  deleteTodo: (id: number) => Promise<void>;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  loadingTodosIds: number[];
  setLoadingTodosIds: (todos: number[]) => void;
}

export const TodoList: React.FC<Props> = ({
  deleteTodo,
  tempTodo,
  preparedTodos,
  updtTodo,
  loadingTodosIds,
  setLoadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {preparedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          updtTodo={updtTodo}
          loadingTodosIds={loadingTodosIds}
          setLoadingTodosIds={setLoadingTodosIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          deleteTodo={deleteTodo}
          todo={tempTodo}
          updtTodo={updtTodo}
          loadingTodosIds={loadingTodosIds}
          setLoadingTodosIds={setLoadingTodosIds}
        />
      )}
    </section>
  );
};
